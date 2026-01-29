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

const getUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
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

const updateUserStatus=async(userId:string,status:"ACTIVE"|"DISABLED")=>{

}


















export const userServices = {
    getAllUser,
}