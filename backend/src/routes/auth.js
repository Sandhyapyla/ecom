import bcrypt from "bcryptjs";
import express from "express";
import { prisma } from "../db/prisma.js";
import { createToken } from "../middleware/auth.js";

export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });
  const existing = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase() },
  });
  if (existing)
    return res.status(409).json({ error: "Email already registered" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email: String(email).toLowerCase(), passwordHash },
  });
  const token = createToken(user);
  res.status(201).json({ token, user: { id: user.id, email: user.email } });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });
  const user = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase() },
  });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = createToken(user);
  res.json({ token, user: { id: user.id, email: user.email } });
});
