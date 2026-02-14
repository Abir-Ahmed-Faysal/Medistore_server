import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";



async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error("Missing admin environment variables");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(" Admin email already exists, skipping.");
    return;
  }

  const data = await auth.api.signUpEmail({
    body: {
      name: adminName,
      email: adminEmail,
      password: adminPassword,
    },
  });

  console.log(data, "from the admin seeding function ");

  if (!data?.user) {
    throw new Error("Admin signup failed");
  }

  await prisma.user.update({
    where: { email: data.user.email },
    data: { role: "ADMIN" },
  });

  console.log(" Admin user created successfully");
}

seedAdmin()
  .catch((e) => {
    console.error(" Admin seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
