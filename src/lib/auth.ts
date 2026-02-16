import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


export const auth = betterAuth({
    baseURL: process.env.APP_URL,
    trustedOrigins: [process.env.PROD_APP_URL as string, "https://medi-store-nu.vercel.app"],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            phone: {
                type: "string",

                required: false
            }
        }
    },
     session: {
        cookieCache: { enabled: true, maxAge: 5 * 60 },
        advanced: {
            cookiePrefix: "better-auth",
            useSecureCookies: process.env.NODE_ENV === "production", crossSubDomainCookies: {
                enabled: false,
            }, disabledCSRFCheck: true,
        }
    }
    ,
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    }
});