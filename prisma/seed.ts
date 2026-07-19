import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed a default admin (override via env in real setups).
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@apnadukaan.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      name: "Platform Admin",
      email,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  // Seed a starter category + locality so listings aren't empty.
  const category = await prisma.category.upsert({
    where: { slug: "grocery" },
    update: {},
    create: { name: "Grocery", slug: "grocery" },
  });

  const locality = await prisma.locality.upsert({
    where: { id: "seed-locality" },
    update: {},
    create: {
      id: "seed-locality",
      name: "Model Town",
      pincode: "110009",
      city: "Delhi",
    },
  });

  await prisma.shop.upsert({
    where: { id: "seed-shop" },
    update: {},
    create: {
      id: "seed-shop",
      name: "Sharma General Store",
      categoryId: category.id,
      localityId: locality.id,
      address: "12 Main Market, Model Town",
      phone: "+919999999999",
      whatsapp: "+919999999999",
      hours: "9:00 AM – 9:00 PM",
      description: "Daily needs, groceries and household items.",
      verified: true,
      isFeatured: true,
    },
  });

  console.log(`Seeded. Admin login: ${email} / ${password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
