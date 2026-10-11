import path from "node:path";
import { Router } from "express";

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? "uploads");

export const filesRouter = Router();

filesRouter.get("/:name", (req, res) => {
  const target = path.join(uploadDir, req.params.name);
  res.sendFile(target, (err) => {
    if (err) res.status(404).json({ error: "file not found" });
  });
});
