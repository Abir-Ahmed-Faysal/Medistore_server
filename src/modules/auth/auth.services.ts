import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

type RegisterDTO = {
    name: string;
    email: string;
    password: string;
    image?: string;
    role?: "USER" | "SELLER";
    phone?: string
};

type CreateUserPayload = {
    role: "USER" | "SELLER"
    phone?: string,
    image?:string
}

const registerUser = async ({ name, email, password, image, phone, role }: RegisterDTO) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const safeRole: "USER" | "SELLER" = role === "SELLER" ? "SELLER" : "USER";




    const payload: CreateUserPayload = {
        role: safeRole,
    }

    if (phone) {
        payload.phone = phone
    }

    if(image){
      payload.image=image
    }

    const user = await auth.api.signUpEmail({
        body: {
            name, email, password, phone
        },
    });

    if (!user) {
        throw new Error("failed to register data")
    }


    const updatedUser = await prisma.user.update({
        where: { id: user.user.id },
        data: { ...payload }
    });




    return updatedUser;
}




export const registerService = {
    registerUser
}