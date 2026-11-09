(() => {
  const DEFAULT_LOST = 'Player disconnected. Match ended.';
  const RTC_CONFIG = { iceServers: [
    { urls: ['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302'] }
  ] };
  const API = {
    client: null, user: null, room: null, seat: -1, members: [], isHost: false,
    username: 'You', names: new Map(), skin: 'stock', skins: new Map(), onSkin: null,
    peers: new Map(), pendingCandidates: new Map(),
    polling: null, heartbeat: null, signalPolling: null, p2pHeartbeat: null, connectTimer: null,
    searchTimeout: null, startupWatch: null,
    finding: false, starting: false, active: false, ending: false,
    lastPacket: 0, readyAt: 0, signalCursor: 0, signalBusy: false,
    snapshotSeq: 0, receivedSnapshotSeq: 0,
    onFound: null, onStart: null, onSnapshot: null, onInput: null, onLost: null
  };
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const errorText = err => (err && err.message) || String(err);
  const sessionKey = 'turboclash-p2p-tab-v1';
  function validUsername(name) { return typeof name === 'string' && /^[A-Za-z0-9_]{3,12}$/.test(name); }
  function receivedName(name, seat) {
    if (Number.isInteger(seat) && seat >= 0 && seat < 6 && validUsername(name)) API.names.set(seat,name);
  }
  function receivedSkin(id, seat) {
    if (Number.isInteger(seat) && seat >= 0 && seat < 6 && typeof id === 'string' && /^[a-z]{2,16}$/.test(id)) { API.skins.set(seat,id); return true; }
    return false;
  }
  function validRoom() { return !!API.room && (API.starting || API.active); }
  function cleanTimers() {
    for (const x of ['polling','heartbeat','signalPolling','startupWatch','p2pHeartbeat']) {
      if (API[x]) clearInterval(API[x]); API[x] = null;
    }
    for (const x of ['searchTimeout','connectTimer']) {
      if (API[x]) clearTimeout(API[x]); API[x] = null;
    }
  }
  async function connect() {
    const cfg = window.PLAYVORA_GAMES || {};
    if (!/^https:\/\/[^/]+\.supabase\.co$/.test(cfg.url || '') || !(cfg.publishableKey || '').startsWith('sb_publishable_')) {
      throw new Error('Playvora games matchmaking is not configured.');
    }
    if (!window.supabase || !window.supabase.createClient) throw new Error('Could not load online matchmaking. Check your connection.');
    if (!window.RTCPeerConnection) throw new Error('Peer-to-peer play needs a browser with WebRTC support and HTTPS.');
    if (!API.client) {
      let storage;
      try {
        storage = window.sessionStorage;
        const k = '__tc_storage_test__'; storage.setItem(k,'1'); storage.removeItem(k);
      } catch (_) {
        const mem = new Map();
        storage = { getItem:k=>mem.get(k)??null, setItem:(k,v)=>mem.set(k,v), removeItem:k=>mem.delete(k) };
      }
      API.client = window.supabase.createClient(cfg.url,cfg.publishableKey,{
        auth:{ storage,storageKey:sessionKey,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false }
      });
    }
    const result = await API.client.auth.getSession();
    if (result.error) throw result.error;
    let user = result.data && result.data.session && result.data.session.user;
    if (!user) {
      const signIn = await API.client.auth.signInAnonymously();
      if (signIn.error) throw Error('Guest sign-in failed: '+signIn.error.message+'. Enable Anonymous Sign-Ins in Supabase.');
      user = signIn.data.user;
    }
    if (!user) throw Error('Could not sign in to matchmaking.');
    API.user = user;
  }
  async function rpc(name,args={}) {
    const {data,error}=await API.client.rpc(name,args);
    if (error) throw error;
    return data;
  }
  function memberBySeat(seat) { return API.members.find(p=>p.seat===seat); }
  function peerByUser(userId) { return [...API.peers.values()].find(p=>p.userId===userId); }
  async function signal(to,message) {
    if (!validRoom()) return;
    await rpc('tc_signal_send',{p_room:API.room,p_to:to,p_message:message});
  }
  function stopSignaling() {
    if (API.signalPolling) clearInterval(API.signalPolling);
    API.signalPolling = null;
  }
  function peerConnected(peer) {
    return peer && peer.control && peer.control.readyState === 'open' &&
      peer.state && peer.state.readyState === 'open' && peer.pc &&
      peer.pc.connectionState === 'connected';
  }
  function startHostIfReady() {
    if (!API.isHost || !API.starting || API.active || !validRoom()) return;
    if (API.peers.size !== API.members.length-1 || ![...API.peers.values()].every(peerConnected)) return;
    if (Date.now()-API.readyAt < 3000) return;
    API.starting=false; API.active=true;
    clearTimeout(API.connectTimer); API.connectTimer=null;
    clearInterval(API.startupWatch); API.startupWatch=null;
    stopSignaling();
    for (const p of API.peers.values()) sendControl(p,{type:'start',names:Object.fromEntries(API.names),skins:Object.fromEntries(API.skins)});
    if (API.onStart) API.onStart();
  }
  function sendControl(peer,packet) {
    if (peer && peer.control && peer.control.readyState==='open') {
      try { peer.control.send(JSON.stringify(packet)); return true; } catch (_) {}
    }
    return false;
  }
  function startGuest() {
    if (!validRoom() || API.active || !API.starting) return;
    const delay = Math.max(0,3000-(Date.now()-API.readyAt));
    setTimeout(()=>{
      if (!validRoom() || API.active || !API.starting) return;
      API.starting=false; API.active=true;
      clearTimeout(API.connectTimer); API.connectTimer=null;
      clearInterval(API.startupWatch); API.startupWatch=null;
      stopSignaling();
      API.lastPacket=Date.now();
      if (API.onStart) API.onStart();
    },delay);
  }
  function detectDisconnect(peer) {
    if (!validRoom() || API.ending || peer.disconnectTimer) return;
    peer.disconnectTimer = setTimeout(()=>{
      peer.disconnectTimer=null;
      if (validRoom() && !peerConnected(peer)) lost(DEFAULT_LOST,'disconnect');
    },6000);
  }
  function applySnapshot(packet) {
    if (!API.active || API.isHost || !packet.data || !Array.isArray(packet.data.cars)) return;
    if (!Number.isInteger(packet.seq) || packet.seq <= API.receivedSnapshotSeq) return;
    API.receivedSnapshotSeq=packet.seq;
    API.lastPacket=Date.now();
    if (API.onSnapshot) API.onSnapshot(packet.data);
  }
  function handleData(peer,data) {
    let packet;
    try { packet=JSON.parse(data); } catch (_) { return; }
    if (!packet || typeof packet !== 'object') return;
    if (packet.type==='leaving') { lost(DEFAULT_LOST,'disconnect'); return; }
    if (packet.type==='start' && !API.isHost) {
      if (packet.names && typeof packet.names==='object') {
        for (const [seat,name] of Object.entries(packet.names)) receivedName(name,Number(seat));
      }
      if (packet.skins && typeof packet.skins==='object') {
        for (const [seat,id] of Object.entries(packet.skins)) receivedSkin(id,Number(seat));
      }
      startGuest(); return;
    }
    if (packet.type==='ping') { peer.lastSeen=Date.now(); return; }
    if (packet.type==='skin') {
      if (API.isHost && receivedSkin(packet.skin,peer.seat) && API.onSkin) API.onSkin(peer.seat,packet.skin);
      return;
    }
    if (API.isHost && API.active && packet.type==='input') {
      if (packet.seat!==peer.seat || !Array.isArray(packet.controls) || packet.controls.length!==7) return;
      if (API.onInput) API.onInput({seat:peer.seat,controls:packet.controls});
    } else if (!API.isHost && packet.type==='snapshot') applySnapshot(packet);
  }
  function bindChannel(peer,channel) {
    if (channel.label==='control') peer.control=channel;
    else if (channel.label==='state') peer.state=channel;
    else { channel.close(); return; }
    channel.onopen=()=>{
      peer.lastSeen=Date.now();
      if (channel.label==='control' && !API.isHost) sendControl(peer,{type:'skin',skin:API.skin});
      if (peer.disconnectTimer) clearTimeout(peer.disconnectTimer);
      peer.disconnectTimer=null;
      startHostIfReady();
    };
    channel.onclose=()=>detectDisconnect(peer);
    channel.onerror=()=>detectDisconnect(peer);
    channel.onmessage=ev=>{
      peer.lastSeen=Date.now();
      handleData(peer,ev.data);
    };
  }
  function makePeer(member,makeOffer) {
    if (API.peers.has(member.seat)) return API.peers.get(member.seat);
    const peer={seat:member.seat,userId:member.user_id,pc:new RTCPeerConnection(RTC_CONFIG),
      control:null,state:null,disconnectTimer:null,lastSeen:Date.now()};
    API.peers.set(member.seat,peer);
    peer.pc.onicecandidate=ev=>{
      if (ev.candidate && validRoom()) signal(peer.userId,{kind:'candidate',candidate:ev.candidate.toJSON()})
        .catch(err=>{ if(validRoom()) lost('Peer connection signaling failed: '+errorText(err),'error'); });
    };
    peer.pc.onconnectionstatechange=()=>{
      if (!validRoom()) return;
      if (peer.pc.connectionState==='connected') {
        if (peer.disconnectTimer) clearTimeout(peer.disconnectTimer);
        peer.disconnectTimer=null;
        startHostIfReady();
      } else if (peer.pc.connectionState==='failed' || peer.pc.connectionState==='disconnected' || peer.pc.connectionState==='closed') {
        detectDisconnect(peer);
      }
    };
    if (makeOffer) {
      bindChannel(peer,peer.pc.createDataChannel('control'));
      bindChannel(peer,peer.pc.createDataChannel('state',{ordered:false,maxRetransmits:0}));
    } else {
      peer.pc.ondatachannel=event=>bindChannel(peer,event.channel);
    }
    return peer;
  }
  async function flushCandidates(peer) {
    if (!peer.pc.remoteDescription) return;
    const queued=API.pendingCandidates.get(peer.userId) || [];
    API.pendingCandidates.delete(peer.userId);
    for (const candidate of queued) {
      try { await peer.pc.addIceCandidate(candidate); } catch(err) { console.warn('Ignored invalid ICE candidate',err); }
    }
  }
  async function processSignal(signalRow) {
    const data=signalRow.message;
    if (!data || !['offer','answer','candidate'].includes(data.kind)) return;
    const member=API.members.find(x=>x.user_id===signalRow.sender);
    if (!member || member.seat===API.seat) return;
    if (data.kind==='offer' || data.kind==='answer') receivedName(data.username,member.seat);
    if (API.isHost && member.seat===0) return;
    if (!API.isHost && member.seat!==0) return;
    if (data.kind==='candidate') {
      const peer=peerByUser(signalRow.sender);
      if (!peer || !peer.pc.remoteDescription) {
        const queued=API.pendingCandidates.get(signalRow.sender)||[];
        if (queued.length<64) queued.push(data.candidate);
        API.pendingCandidates.set(signalRow.sender,queued);
      } else {
        try { await peer.pc.addIceCandidate(data.candidate); } catch(_) {}
      }
      return;
    }
    if (data.kind==='offer' && !API.isHost) {
      const peer=makePeer(member,false);
      await peer.pc.setRemoteDescription({type:'offer',sdp:data.sdp});
      await flushCandidates(peer);
      const answer=await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);
      await signal(peer.userId,{kind:'answer',sdp:peer.pc.localDescription.sdp,username:API.username});
    } else if (data.kind==='answer' && API.isHost) {
      const peer=peerByUser(signalRow.sender);
      if (peer && !peer.pc.remoteDescription) {
        await peer.pc.setRemoteDescription({type:'answer',sdp:data.sdp});
        await flushCandidates(peer);
      }
    }
  }
  async function pollSignals() {
    if (!validRoom() || API.signalBusy) return;
    API.signalBusy=true;
    try {
      const messages=await rpc('tc_signal_poll',{p_after:API.signalCursor});
      if (!validRoom()) return;
      for (const m of messages || []) {
        if (m.id<=API.signalCursor) continue;
        await processSignal(m);
        API.signalCursor=m.id;
      }
    } catch(err) {
      if(validRoom()) lost('Peer connection setup failed: '+errorText(err),'error');
    } finally { API.signalBusy=false; }
  }
  async function connectPeers() {
    if (!validRoom()) return;
    API.connectTimer=setTimeout(()=>{
      if (validRoom() && !API.active) lost('Could not establish a direct player connection. Some networks need a TURN relay.','error');
    },45000);
    API.startupWatch=setInterval(startHostIfReady,180);
    API.p2pHeartbeat=setInterval(()=>{
      if (!API.active || API.ending) return;
      const now=Date.now();
      for (const peer of API.peers.values()) {
        if (now-peer.lastSeen>14000) { lost(DEFAULT_LOST,'disconnect'); return; }
        sendControl(peer,{type:'ping'});
      }
    },3000);
    API.signalPolling=setInterval(pollSignals,650);
    await pollSignals();
    if (!validRoom()) return;
    if (API.isHost) {
      for (const member of API.members) {
        if (member.seat===API.seat) continue;
        const peer=makePeer(member,true);
        const offer=await peer.pc.createOffer();
        await peer.pc.setLocalDescription(offer);
        await signal(peer.userId,{kind:'offer',sdp:peer.pc.localDescription.sdp,username:API.username});
      }
    }
  }
  async function search(settings) {
    await cancel();
    API.finding=true; API.starting=false; API.active=false; API.ending=false;
    try {
      await connect();
      if (!API.finding) return;
      await rpc('tc_leave');
      if (!API.finding) return;
      const ticket=await rpc('tc_join',{p_mode:settings.mode,p_duration:settings.len,p_skill:settings.diff});
      if (!API.finding) { API.room=ticket.room_id; await cancel(); return; }
      API.room=ticket.room_id; API.seat=ticket.seat; API.isHost=ticket.seat===0;
      API.members=[]; API.signalCursor=0; API.snapshotSeq=0; API.receivedSnapshotSeq=0;
      API.names.clear(); receivedName(API.username,API.seat);
      API.skins.clear(); receivedSkin(API.skin,API.seat);
      API.heartbeat=setInterval(async()=>{
        if (!API.room) return;
        try {
          const st=await rpc('tc_status');
          if (API.room && (st.status==='none' || st.status==='cancelled')) {
            lost(DEFAULT_LOST,'disconnect');
          }
        } catch(_) { }
      },8000);
      const poll=async()=>{
        if (!API.finding) return;
        try {
          const st=await rpc('tc_status');
          if (!API.finding) return;
          if (st.status==='none' || st.status==='cancelled') return lost('That matchmaking room closed. Try again.','error');
          if (st.status==='ready' && Array.isArray(st.players) && st.players.length===settings.mode*2) {
            API.members=st.players;
            API.finding=false; API.starting=true; API.readyAt=Date.now();
            clearInterval(API.polling); API.polling=null;
            clearTimeout(API.searchTimeout); API.searchTimeout=null;
            if (API.onFound) API.onFound();
            await connectPeers();
          }
        } catch(err) { if(API.finding) lost('Matchmaking failed: '+errorText(err),'error'); }
      };
      API.polling=setInterval(poll,1100);
      API.searchTimeout=setTimeout(()=>{if(API.finding)lost('No other player joined this search. Try again.','error');},120000);
      await poll();
    } catch(err) {
      await cancel();
      throw err;
    }
  }
  function sendInput(controls) {
    if (!API.active || API.isHost) return;
    const host=API.peers.get(0);
    if (!host) return;
    if (host.control && host.control.readyState==='open' && host.control.bufferedAmount<65536) {
      sendControl(host,{type:'input',seat:API.seat,controls});
    } else if (host.state && host.state.readyState==='open' && host.state.bufferedAmount<65536) {
      host.state.send(JSON.stringify({type:'input',seat:API.seat,controls}));
    }
  }
  function sendSnapshot(snapshot) {
    if (!API.active || !API.isHost) return;
    const message={type:'snapshot',seq:++API.snapshotSeq,data:snapshot};
    const packet=JSON.stringify(message);
    for (const peer of API.peers.values()) {
      if (peer.state && peer.state.readyState==='open' && peer.state.bufferedAmount<200000) {
        try { peer.state.send(packet); } catch (_) { detectDisconnect(peer); }
      }
      if (API.snapshotSeq % 5===0) sendControl(peer,message);
    }
  }
  async function cancel() {
    API.finding=false; API.starting=false; API.active=false;
    cleanTimers();
    for (const peer of API.peers.values()) sendControl(peer,{type:'leaving'});
    if (API.peers.size) await sleep(100);
    for (const peer of API.peers.values()) {
      if (peer.disconnectTimer) clearTimeout(peer.disconnectTimer);
      try { peer.pc.close(); } catch(_) {}
    }
    API.peers.clear(); API.pendingCandidates.clear(); API.names.clear(); API.skins.clear();
    API.signalBusy=false; API.signalCursor=0;
    const room=API.room;
    API.room=null; API.seat=-1; API.members=[]; API.isHost=false;
    if (room && API.client) await rpc('tc_leave').catch(()=>{});
  }
  async function lost(message,reason='error') {
    if (API.ending || (!API.room && !API.finding && !API.starting && !API.active)) return;
    API.ending=true;
    const cb=API.onLost;
    await cancel();
    if (cb) cb(message,reason);
  }
  API.setUsername=name=>{
    if (!validUsername(name)) throw new Error('Invalid username');
    API.username=name;
  };
  API.setSkin=id=>{ if (typeof id==='string' && /^[a-z]{2,16}$/.test(id)) API.skin=id; };
  API.search=search; API.cancel=cancel;
  API.sendInput=sendInput; API.sendSnapshot=sendSnapshot; API.lost=lost;
  window.TCMultiplayer=API;
})();
