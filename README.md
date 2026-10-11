# Parcelo Orders API

The orders and shipping service behind the Parcelo checkout. Small Express and
TypeScript service, no database yet: orders live in memory while we settle the
schema.

## Run it

```bash
npm ci
npm run dev        # http://localhost:3000
npm test
```

Configuration is through environment variables:

| Variable | Default | What it does |
|----------|---------|--------------|
| `PORT`   | `3000`  | Port the server listens on |

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | Liveness check |
| GET | `/orders?page=1&limit=20` | Paginated list |
| POST | `/orders` | Create an order |
| GET | `/orders/:id` | Fetch one order |
| POST | `/orders/:id/ship` | Mark an order shipped |
| POST | `/products` | Register a product slug |
| GET | `/files/:name` | Download an uploaded file |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security problems: [SECURITY.md](SECURITY.md).
// simulated upstream rebase
