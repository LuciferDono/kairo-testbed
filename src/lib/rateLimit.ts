import type { NextFunction, Request, Response } from "express";

interface Options {
  windowMs: number;
  max: number;
}

interface Hit {
  count: number;
  resetAt: number;
}

export function rateLimit(options: Options) {
  const hits = new Map<string, Hit>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip ?? "anonymous";
    const now = Date.now();
    const record = hits.get(key);

    if (!record) {
      hits.set(key, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }

    record.count += 1;
    if (record.count > options.max) {
      res.status(429).json({ error: "too many requests" });
      return;
    }
    next();
  };
}
