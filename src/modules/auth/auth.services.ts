import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

type RegisterDTO = {
    name: string;
    email: string;
    password: string;
    image?: string;
    role?: "USER" | "SELLER";
};

const registerUser = async ({ name, email, password, image, role }: RegisterDTO) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const safeRole: "USER" | "SELLER" = role === "SELLER" ? "SELLER" : "USER";




    // const authPayload = [name, email, password, image].filter((key, value) => value !== null || value !== undefined)



    const result = await prisma.$transaction(async (tx) => {

        const user = await auth.api.signUpEmail({
            body: {
                name, email, password, image,
            },
        });

        // Role update
        const updatedUser = await tx.user.update({
            where: { id: user.user.id },
            data: { role: safeRole },
        });

        
        
        return updatedUser;
    });

    return result;
}




export const registerService = {
    registerUser
}