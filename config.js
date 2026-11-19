// Static sites cannot run PeerServer or TURN. Configure your own services here if needed.
export const NETWORK = {
  prefix: 'tidal-dominion-v1-',
  peerOptions: { debug: 0
    // host: 'peer.example.com', port: 443, path: '/', secure: true,
    // config: {iceServers: [{urls:'stun:stun.example.com:3478'},
    // {urls:'turn:turn.example.com:3478',username:'TEMP_USER',credential:'TEMP_TOKEN'}]}
  }
};
