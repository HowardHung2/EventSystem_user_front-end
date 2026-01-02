# EventSystem_user_front-end

Vue 3 + Vite frontend for the Event System user app.

## Project Structure

- `src/` Vue app source (`main.js`, `App.vue`, shared services)
- `public/` static assets copied to build output
- `index.html` Vite entry HTML
- `vite.config.js` Vite config
- `config.example.env` / `config.dev.env` / `config.prod.env` env templates

## Environment

Vite exposes `import.meta.env` variables with a `VITE_` prefix. This project reads:

- `ROOT_URL` / `VITE_ROOT_URL` (API base)
- `ACCESS_TOKEN_KEY` / `VITE_ACCESS_TOKEN_KEY` (localStorage key)

If you want Vite to load env values automatically, copy one of the templates to
`.env`, `.env.development`, or `.env.production` and use the `VITE_` variants.

## Scripts

```sh
npm install
npm run dev
npm run build
npm run preview
npm run format
npm run format:check
```

## Git Hooks

Pre-commit runs `lint-staged` with Prettier to auto-format staged files.
Run `npm install` once to enable Husky hooks.

## Editor

VS Code + Vue (Official) extension is recommended.
