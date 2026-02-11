# Deploying on Render — fix "No open ports" / health check / OOM

Your logs show Render is running **`npm run dev`**. That uses ts-node + nodemon and runs out of memory, so the server never starts and no port is opened.

## Fix: set the Start Command in Render

1. Open [Render Dashboard](https://dashboard.render.com/) → your **zynvo-backend** service.
2. Go to **Settings** (left sidebar).
3. Under **Build & Deploy**, find **Start Command**.
4. Set it to exactly:
   ```bash
   npm run start
   ```
   (or `npm run deploy` — same thing)
5. **Save Changes**.
6. Go to **Manual Deploy** → **Deploy latest commit** (or push a new commit to trigger a deploy).

Do **not** use `npm run dev` as the start command. Use `npm run start` so Render runs the compiled `dist/index.js` with Node.

## Health check

- **Health check path:** `/health` (no port in the URL — Render uses the service’s assigned port).
- If you had a custom health check URL with `:8000`, remove the port and use only the path `/health`.

## Using the Blueprint (optional)

If you create the service from the repo’s **Blueprint** (`render.yaml`), the start command and health check path are set automatically. For an existing service, changing the Start Command in Settings (steps above) is enough.
