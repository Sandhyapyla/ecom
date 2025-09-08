import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
// Prisma is used for DB access; no Mongoose connection needed
import { authRouter } from "./routes/auth.js";
import { cartRouter } from "./routes/cart.js";
import { itemsRouter } from "./routes/items.js";
import { seedItemsIfEmpty } from "./seed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "E-commerce API" });
});

app.use("/auth", authRouter);
app.use("/items", itemsRouter);
app.use("/cart", cartRouter);

async function start() {
  await seedItemsIfEmpty();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});
