# Express-app

Get started with express

## For production

1. Run `npm run build`
2. Run `npm run start`

## For Testing

`npm run dev`

## Deploying on Render

- **Start Command must be** `npm run start` (runs compiled `dist/index.js`). Do **not** use `npm run dev` in production — it uses ts-node/nodemon and will run out of memory.
- Health check path: `/health`. Do not hardcode port 8000 in the health check URL; Render assigns `PORT` (e.g. 10000) and the app binds to `process.env.PORT`.
- You can use the included `render.yaml` (Blueprint) so the service uses the correct build and start commands.
