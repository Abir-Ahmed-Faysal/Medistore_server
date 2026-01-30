import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";


async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  const adminName = process.env.ADMIN_NAME!;

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error("Missing admin environment variables");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("email already exists, skipping.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: adminName,
      email: adminEmail,
      role: "ADMIN",

      accounts: {
        create: {
          id: crypto.randomUUID(),
          providerId: "credentials",
          accountId: adminEmail,
          password: hashedPassword,
        },
      },
    },
  });

  console.log(" Admin user created successfully");
}

seedAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
