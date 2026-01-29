import { prisma } from "../../lib/prisma"

const getAllUser = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            role: true
        },
    });
    return users;
};

const getUser = async (id:string) => {
    const user = await prisma.user.findUnique({
        where: { id: id },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            role: true
        }
    })
    return user
}



















export const userServices = {
    getAllUser, getUser
}