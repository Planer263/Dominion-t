# Validation & playtest checklist

Build-time static/simulation checks are not a real browser or network test. Complete this checklist after serving/deploying to HTTPS.

## Static build

- Verify all module requests load from the pinned CDN, and no browser console errors appear.
- Run `npm test` with Node 18+. Check each map seed/style has sufficient land and deterministic output.
- Verify the GitHub Pages root and nested `/tidal-dominion/` path both load correctly. Check invite links preserve relative paths.

## Browser and gameplay

- Chrome, Firefox, Safari, Edge; desktop and phone; portrait/landscape.
- Solo against 0, 1, and 10 bots; host + guest + bots; fill six human slots and reject a seventh.
- Test all map styles, fixed and fresh seeds, bot personalities, max player count and overlapping deployment attempts.
- Deploy by clicking and moving your capital; leave an unplaced seat; deploy two nearby users; host early start.
- Grow, cap, attack neutral, attack player, reinforce, stop, survive capture, lose all tiles. Check capacity/income and territory percentage.
- Build cities / forts / ports; insufficient gold; spacing, max buildings, neutral/enemy/build placement, coast restriction; conquest transfers building ownership.
- Transport from port to neutral coast / enemy coast / inland / water / truced nation; three ship limit; successful and failed capture; delayed route visualization.
- Truce requests both ways, accept, reject by timeout, attack/boat blocked, campaign return, timer expiry, gift. Verify bots honor active truces.
- Eliminate bot/human, inspect eliminated nation, victory threshold, sole surviving nation, rematch and result inspection.
- Verify zoom, drag/pan, tile inspection, selected tile, unit labels, crowded rankings, mobile command tools, map fit and center.
- Hide/blur host and guest tabs; recover visibility; refresh either peer midgame; restart host. Confirm known no-reconnect consequences and no stuck order loop.

## Internet multiplayer

- Two distinct devices / two separate network connections; two player names/colors and shared settings.
- Create room; copy link/code; join; wrong/short/unknown code; cancelled host; host gone; duplicate open code; signaling unavailable; mismatched protocol; third-party joins; untrusted wrong guest.
- 5–16 seconds join/host timeout behavior; heartbeat loss; guest quit; host quit; host private/public browser.
- Latency, packet loss, high-latency cellular, IPv4/IPv6, VPN, school/work NAT, restrictive firewall. Provision/test TURN where direct ICE fails.
- Check snapshot and delta correctness after 25 ticks, owner transfers, city captures, large world, many active armies, late join rejection, client disconnect converted to AI.
- Public services are dependencies; do not advertise as globally connectable until verified on the target hosting/network configuration.

## Evidence already checked in build environment

`engine.js`, `network.js`, `renderer.js`, `app.js`, and `config.js` passed Node syntax checks. `tests/engine.test.mjs` passed deterministic map generation for three map styles, ownership/economy invariants, full+delta snapshot application, basic treaty/gift/invalid command checks, and a neutral-territory conquest smoke test. A mock-canvas renderer API smoke test also passed; this does not establish visual correctness. HTML IDs were unique, and direct JS `$()` ID references match the page. No browser automation, screenshot, hardware-accelerated rendering, peer connection, or real-time performance checks were available.

Mock-wire room protocol checks also passed for handshake, roster propagation, assigned guest identity, command forwarding and state broadcast. These do not exercise PeerServer, ICE, NAT traversal or actual WebRTC.
