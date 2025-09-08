import express from "express";
import { prisma } from "../db/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

export const cartRouter = express.Router();

cartRouter.get("/", authMiddleware, async (req, res) => {
  const docs = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { item: true },
  });
  const detailed = docs.map((d) => ({
    itemId: d.itemId,
    quantity: d.quantity,
    item: d.item,
  }));
  res.json({ items: detailed });
});

cartRouter.post("/add", authMiddleware, async (req, res) => {
  const { itemId, quantity } = req.body || {};
  if (!itemId) return res.status(400).json({ error: "itemId required" });
  const qty = Math.max(1, Number(quantity) || 1);
  const it = await prisma.item.findUnique({ where: { id: itemId } });
  if (!it) return res.status(404).json({ error: "Item not found" });
  const existing = await prisma.cartItem.findUnique({
    where: { userId_itemId: { userId: req.user.id, itemId } },
  });
  if (existing) {
    await prisma.cartItem.update({
      where: { userId_itemId: { userId: req.user.id, itemId } },
      data: { quantity: existing.quantity + qty },
    });
  } else {
    await prisma.cartItem.create({
      data: { userId: req.user.id, itemId, quantity: qty },
    });
  }
  res.status(201).json({ ok: true });
});

cartRouter.post("/remove", authMiddleware, async (req, res) => {
  const { itemId, quantity } = req.body || {};
  if (!itemId) return res.status(400).json({ error: "itemId required" });
  const removeQty = Number(quantity);
  const existing = await prisma.cartItem.findUnique({
    where: { userId_itemId: { userId: req.user.id, itemId } },
  });
  if (!existing) return res.status(404).json({ error: "Item not in cart" });
  if (removeQty && removeQty > 0) {
    const nextQty = existing.quantity - removeQty;
    if (nextQty > 0)
      await prisma.cartItem.update({
        where: { userId_itemId: { userId: req.user.id, itemId } },
        data: { quantity: nextQty },
      });
    else
      await prisma.cartItem.delete({
        where: { userId_itemId: { userId: req.user.id, itemId } },
      });
  } else {
    await prisma.cartItem.delete({
      where: { userId_itemId: { userId: req.user.id, itemId } },
    });
  }
  res.json({ ok: true });
});

cartRouter.post("/clear", authMiddleware, async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ ok: true });
});
