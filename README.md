# Pixel Pilot · Intel × CMRIT

**Play:** [pixelpilot-7ci.pages.dev](https://pixelpilot-7ci.pages.dev)

Pixel Pilot is a retro arcade survival shooter for the Intel × CMRIT Million Minds challenge. Pilot an Intel ship, collect upgrade chips, chain enemy takedowns, and face sector guardians. After a run, choose a real-life PC use and get a tailored AI PC demo idea with links to the retailers named in the brief.

## Play

- Move with **← / →**, **A / D**, or drag on the playfield.
- Fire with **Space**, the **A** cabinet button, or tap the screen.
- Collect Intel core chips to upgrade your ship. Rapid fire, shields, magnets, and nova pulses are separate drops.
- Each run has three lives and continues through infinite sectors until the ship is lost.
- Guardians arrive every three sectors. Their attack tells, movement, and second phases vary by guardian.

## AI PC learning

The game introduces on-device AI, NPU-supported effects, and CPU/GPU/NPU roles through short mission facts and a post-run recommendation. It does not present game scores as hardware benchmarks. AI features depend on the exact PC, software, settings, and region; the recommendation suggests a store demo rather than a particular laptop SKU.

## Technology

- Single-page HTML, CSS, and Canvas game
- Cloudflare Pages Functions endpoint at `functions/api/scores.js`
- Cloudflare D1 leaderboard schema at `db/schema.sql`; the Pages binding name is `DB`

