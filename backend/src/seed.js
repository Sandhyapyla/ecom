import { prisma } from "./db/prisma.js";

export async function seedItemsIfEmpty() {
  const count = await prisma.item.count();
  if (count > 0) return;
  const sample = [
    {
      title: "Classic Tee",
      description: "Soft cotton tee for everyday wear",
      price: 20,
      category: "apparel",
      image: "https://picsum.photos/seed/tee/400/300",
    },
    {
      title: "Running Shoes",
      description: "Lightweight shoes designed for comfort and speed",
      price: 80,
      category: "footwear",
      image: "https://picsum.photos/seed/shoes/400/300",
    },
    {
      title: "Noise-Canceling Headphones",
      description: "Immersive sound with active noise cancelation",
      price: 149,
      category: "electronics",
      image: "https://picsum.photos/seed/headphones/400/300",
    },
    {
      title: "Espresso Maker",
      description: "Brew barista-quality espresso at home",
      price: 129,
      category: "home",
      image: "https://picsum.photos/seed/espresso/400/300",
    },
  ];
  await prisma.item.createMany({ data: sample, skipDuplicates: true });
}
