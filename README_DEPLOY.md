# EPPLANNERPRO2025 — Clean deploy

Deze repo is opgeschoond voor Netlify zonder build.
- **Publiceer**: map `dist/`
- **Netlify config**: `netlify.toml` zet `publish = "dist"` en `command = ""` (geen build)
- **Streams lijst**: `dist/artists.json` (objecten met `name` + `id`), bevat nu 32 artiesten incl. Dreamflow, Poluz, Doris Lost, Eternal, Sleepy Teas, ZizZa, Slaapmutsje.

## Zo deploy je
1) Upload de **inhoud** van deze map naar GitHub (root van de repo).
2) In Netlify → Site settings → Build & deploy:
   - Build command: *(leeg)*
   - Publish directory: `dist`
3) Deploys → Clear cache and deploy site
4) Controle: open `/artists.json` → moet 32 items tonen.