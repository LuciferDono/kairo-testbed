import express, { type NextFunction, type Request, type Response } from "express";
import { rateLimit } from "./lib/rateLimit";
import { filesRouter } from "./routes/files";
import { ordersRouter } from "./routes/orders";
import { productsRouter } from "./routes/products";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(rateLimit({ windowMs: 60_000, max: Number(process.env.RATE_LIMIT_MAX ?? 100) }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/orders", ordersRouter);
  app.use("/products", productsRouter);
  app.use("/files", filesRouter);

  app.get("/{*wildcard}", (_req, res) => {
    res.status(404).json({ error: "not found" });
  });

  app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: "internal error" });
  });

  return app;
}
