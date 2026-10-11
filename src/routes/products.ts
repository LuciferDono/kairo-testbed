import { Router } from "express";
import { isValidSlug } from "../lib/slug";

export const productsRouter = Router();

productsRouter.post("/", (req, res) => {
  const slug = String(req.body?.slug ?? "");
  if (!isValidSlug(slug)) {
    res.status(400).json({ error: "invalid slug" });
    return;
  }
  res.status(201).json({ slug });
});
