import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function createToken(user) {
  const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign({ sub: user.id || user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}
