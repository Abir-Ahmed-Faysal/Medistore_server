import { betterAuth, boolean } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }), user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            }, banned: {
                type: "boolean",
                defaultValue: false,
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    }
});