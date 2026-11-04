import "dotenv/config";
import bcrypt from "bcryptjs";
import { getPrisma } from "../lib/prisma";

async function main() {
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) before seeding.");
  }
  const prisma = getPrisma();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Administrator account already exists: ${email}`);
    return;
  }
  await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 12), role: "ADMIN" },
  });
  console.log(`Administrator account created: ${email}`);
}
main()
  .catch((error) => { console.error("Database seed failed:", error); process.exitCode = 1; })
  .finally(async () => { await getPrisma().$disconnect(); });
