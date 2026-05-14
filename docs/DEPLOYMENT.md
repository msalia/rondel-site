# Deployment

## How It Works

This project deploys to Dokploy at https://dok.msalia.org.
Dokploy pulls from the GitHub repo, builds with a multi-stage Dockerfile
(Node 20 Alpine), and runs the Next.js standalone server on port 3000
behind HTTPS at rondel.msalia.org.

## Ship Code

Use the `/project ship` command or manually:

```bash
# Format and lint
npm run lint

# Commit and push
git add -A
git commit -m "feat: description"
git push

# Trigger deploy (read TOKEN and API_BASE from infra.json)
curl -s -H "x-api-key: $TOKEN" "$API_BASE/application.redeploy" \
  -X POST -H "Content-Type: application/json" \
  --data-raw '{"json":{"applicationId":"uOrcbLTWAPHFF9VcNrWfe"}}'
```

## Environment Variables

Set via Dokploy dashboard or API:
```bash
curl -s -H "x-api-key: $TOKEN" "$API_BASE/application.update" \
  -X POST -H "Content-Type: application/json" \
  --data-raw '{"json":{"applicationId":"uOrcbLTWAPHFF9VcNrWfe","env":"KEY=value\nKEY2=value2"}}'
```
