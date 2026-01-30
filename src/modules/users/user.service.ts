import { prisma } from "../../lib/prisma"

const getAllUser = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            banned: true,
            role: true
        },
    });
    return users;
};

const banUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, banned: true }
  });

  if (!user) {
    throw Error("User not found");
  }


  if (user.banned) {
    throw new Error("User already banned");
  }

  return prisma.user.update({
    where: { id },
    data: { banned: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true
    }
  });
};

const unBanUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { banned: true }
  });

  if (!user) {
    throw new Error( "User not found");
  }

  if (!user.banned) {
    throw new Error( "User is not banned");
  }

  return prisma.user.update({
    where: { id },
    data: { banned: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true
    }
  });
};


export const userService = {
    getAllUser, banUser,unBanUser
}