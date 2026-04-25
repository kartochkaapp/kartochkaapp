# App Path Deployment

The authenticated workspace should live on the same primary domain and be served from the same `index.html` entrypoint as the public routes.

Expected routes:
- `https://<domain>/app`
- `https://<domain>/app/create`
- `https://<domain>/app/improve`
- `https://<domain>/app/fourCards`
- `https://<domain>/app/tools`
- `https://<domain>/app/animate`
- `https://<domain>/app/history`

The public marketing host keeps `/` pointed to `public.html`, while `/app` and related app-mode paths rewrite to `index.html`.
