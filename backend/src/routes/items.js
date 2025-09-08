import express from "express";
import { prisma } from "../db/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

export const itemsRouter = express.Router();

itemsRouter.get("/", async (req, res) => {
  const { category, minPrice, maxPrice, q } = req.query;
  const where = {};
  if (category) {
    const cats = String(category)
      .split(",")
      .map((c) => c.trim().toLowerCase());
    where.category = { in: cats };
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }
  if (q) {
    const term = String(q).trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
    ];
  }
  const items = await prisma.item.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json({ items });
});

itemsRouter.get("/:id", async (req, res) => {
  const it = await prisma.item.findUnique({ where: { id: req.params.id } });
  if (!it) return res.status(404).json({ error: "Item not found" });
  res.json(it);
});

itemsRouter.post("/", authMiddleware, async (req, res) => {
  const { title, description, price, category, image } = req.body || {};
  if (!title || !price || !category)
    return res
      .status(400)
      .json({ error: "title, price, category are required" });
  const it = await prisma.item.create({
    data: {
      title,
      description: description || "",
      price: Number(price),
      category,
      image,
    },
  });
  res.status(201).json(it);
});

itemsRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await prisma.item.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (e) {
    return res.status(404).json({ error: "Item not found" });
  }
});

itemsRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const removed = await prisma.item.delete({ where: { id: req.params.id } });
    res.json(removed);
  } catch (e) {
    return res.status(404).json({ error: "Item not found" });
  }
});
