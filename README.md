# TIDAL DOMINION — Tidal Games

A static-hostable, real-time territory-conquest strategy prototype for 2–6 human players and up to 10 AI nations. Procedurally generated pixel-shaded maps, neutral land expansion, troop campaigns, AI opponents, cities, forts, ports, timed transport landings, truces, gifts, and a live leaderboard. Original branding/assets; an independent game inspired by the territory-conquest genre, not an OpenFront clone or associated project.

## Publish on GitHub Pages

1. Add this folder's contents to a repository root, or upload the folder to an existing Tidal Games repository and link to `./tidal-dominion/`.
2. In Settings → Pages, select Deploy from a branch, `main`, and `/(root)`.
3. Open the site over HTTPS. Both Three.js-independent map rendering and the game engine are local; PeerJS is loaded on demand from a CDN for multiplayer.

Online play needs a working network connection to PeerJS's public signaling server. Start with Create a multiplayer room and send the generated invite to friends. Guest players choose their own nation name/color and join before the host starts. Each room supports up to six human players. Add AI to fill empty seats or provide rivals. The host's browser runs and distributes the game simulation.

Open the site over local HTTP for development. Because this is a JavaScript ES module site, do not launch it by double-clicking `index.html` with `file://`. No npm install, build, or bundling is needed. Dependency: PeerJS 1.5.4 through a pinned esm.sh bundle; this is fetched only when networking is selected. GitHub Pages does not run a game server.

## Game guide

### Deployment

Choose a nation name and color before creating a room. Host chooses a map style, seed, number of AI nations (0–10), and temperament. Maximum 16 total nations. Starting locations must be at least 10 map cells apart. Click land to place or move your capital during the 20-second deployment window. Unplaced nations receive automatic starting locations. If the chosen settings generate too little land for a viable map, pick a different seed/style.

### Expansion, combat, and victory

Choose an attack commitment from 5–90%. Click Expand and select a neutral tile or an enemy tile you border. An attack commits a percentage of the current troop reserve into a campaign. Campaigns advance automatically each tick through the selected target's border, capturing a wave of up to 18 edge tiles. A concentrated direction can shift as territory changes; the target marks the preferred destination, not a guaranteed route. You can reinforce an existing campaign against the same rival. Stop returns half its remaining troops, not all. Up to three campaigns per player.

Claiming higher-terrain tiles and capturing defended territory costs more. Defensive forts increase terrain defense for nearby tiles. Troop loss on capture depends on defender troop reserve relative to land area. Victory is owning 65% of generated land or being the last surviving nation. A nation is eliminated when it loses all territory. All map territory and economy are visible; there is no fog of war.

### Economy & buildings

Troops, troop capacity, and gold grow automatically. Troop growth slows when a nation approaches its capacity. Current build costs: city 150, fort 100, coastal port 180. Cities add income and troop capacity; ports add income and are required to launch landings; forts improve defense near their location. To construct, select a build tool and click your own tile. Buildings must be at least two map cells apart. Up to 40 buildings per nation. Infrastructure is lost or changes owner when its tile is captured.

### Naval landings

Build a port, choose Land, select a coastal land tile anywhere on the map, and commit troops. A landing costs 50 gold, takes time proportional to map distance, and sends one of at most three active transports. Successful landings capture one beachhead tile and can start a land campaign. Target must be land with at least one adjacent sea tile. This prototype has no naval pathfinding, realistic ocean travel, transport interception, ship combat, or convoy retreat; a transport's path is visualized as a direct route. Landings are strategically useful for reaching islands across the generated land/sea map.

### Diplomacy

Select a rival in the leaderboard or click its land. Offer a truce; the other side explicitly accepts. Truces last 60 seconds, prevent direct attacks/landings, and the remaining time is shown. Active campaigns targeting the other party stop and their remaining committed units are returned to their owner. During a truce, either party can gift 20% of its current troop reserve. There is no betrayal system, chat, or alliance teams. Truce negotiation works with AI as well as human players; AI behavior is rule-based.

### Controls

Mouse/touch: drag map to pan; scroll or use +/- to zoom; click land to choose and command; click/right-click to inspect land, factions, and neutral tiles; use the right leaderboard to inspect nations. Touch devices can tap and pan; visible +/- controls are provided. Pinch zoom is not implemented.

Keyboard shortcuts: `1` Expand, `2` City, `3` Fort, `4` Port, `5` Landing, `C` center on your nation, `F` fit entire world, `Esc` close selected intelligence panel. Attack commitment slider is adjustable in the command bar. Active campaigns appear in the lower-right; × cancels one. Stop cancels all your campaigns.

## Multiplayer design

This game uses the **same PeerJS/WebRTC approach as You Need 2**, not NetplayJS. Host-authoritative deterministic-tick model: host runs simulation at 5 ticks/sec; guests send rate-limited commands (12/sec) over reliable peer data connections; host broadcasts player roster, snapshot/delta, active campaigns, and world state. Guests apply authoritative deltas locally. Peer ID namespace is `tidal-dominion-v1-` plus eight symbols from an unambiguous 32-character alphabet. Host retries ID collisions up to four times. Rooms hold 2–6 human participants. No custom game backend is required, but the public PeerJS signaling service is required for connection establishment.

Multiplayer quality/stability has not been measured across browsers, connectivity environments, or packet loss. No client prediction, rollback, host migration, reconnection, spectating join-in-progress, saved matches, chat, or server-side enforcement. The host must keep its tab open, online, and visible; a host leaving ends the match. A guest disconnect becomes an AI-controlled nation, and the host can update its roster. A client cannot join after the game starts.

Public PeerJS signaling is an external dependency and may be unavailable. With default PeerJS configuration, WebRTC relies on available ICE/STUN paths; restrictive NAT/firewall/VPN/school/work networks often require a TURN relay. A TURN configuration can be supplied through `config.js`, but use short-lived credentials generated by an external relay service; never publish a long-lived TURN secret in a public repository. GitHub Pages cannot host TURN, PeerServer, or other dynamic services. A CDN/network outage blocks online mode but does not prevent playing local AI practice if app modules loaded.

Security: a room code is an invitation, not authentication. Anyone possessing the code may try to join while the room is open. Share it privately with people you trust. Host is authoritative, so a modified host can alter gameplay. Rate limiting, payload/type bounds, connection timeouts, and protocol versioning are basic prototype safeguards—not adversarial anti-cheat. No account, analytics, telemetry, or in-game chat. Peer signaling and WebRTC may disclose ordinary IP/network metadata to infrastructure or match participants. Avoid sensitive real names in nation labels.

## Development & tests

- `index.html`, `style.css`: screens, lobby, responsive game UI.
- `engine.js`: generated map, simulation, conquest, economy, building, diplomacy, bots.
- `renderer.js`: responsive Canvas 2D map, terrain/borders/labels, armies, ports, campaigns.
- `network.js`: PeerJS rooms, handshakes, room membership, protocol, heartbeat.
- `app.js`: application flow, lobby, interface and snapshots.
- `config.js`: public PeerJS namespace and optional custom service configuration.
- `tests/`: deterministic map, snapshots/deltas, tick invariants, treaty/gift/attack tests a renderer API smoke test using a mock canvas, and a room-protocol test using an in-memory mock wire (not browser/WebRTC tests).

Run `npm test` with Node 18+ for simulation smoke checks. Tests cover fixed seeds/styles, territory accounting, owner indexes, finite/capped economy, map snapshots/deltas, treaty operations, command validation, and conquest. They do not cover browser UI, visual legibility at all device sizes, AI balance, WebRTC, real multiplayer, or worst-case network conditions.

## Known prototype limitations

- Map is fixed at 144×92; generated land composition varies by seed/style. Placement and home overlap are checked; automatic fallback is used if a bot has trouble spawning.
- Fixed-interval world updates are host-browser scheduled; slow/hidden host tabs can throttle. Host sends occasional full map snapshots, and deltas otherwise.
- A port is required for transports to neutral or enemy coastal land. No water ownership, naval units, port upgrades, nukes, weapons trees, detailed terrain rendering, sound, fog, replays, saved campaign, global chat, or private team modes.
- AI is simple rule-based expansion, construction and truce acceptance; do not assume competitive human strategy.
- Cities and forts are original simplified mechanics. Do not confuse the prototype's numbers/rules with OpenFront rules.
- The host's map generation, roster and simulation are critical authority. State packet and sequence validation need further audit for hostile or malformed clients.
- No browser-based tests or cross-device run were possible in this build environment; perform `TESTING.md` before wide sharing.

## Credits & license

Original code/artwork by Tidal Games contributors. MIT license for this project source. PeerJS is a third-party package under its respective license. Inspired by the broad territory-conquest strategy genre; not affiliated with or an asset/code copy of OpenFront.io.
