import { betterAuth, boolean } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins:[process.env.FRONTEND_URL as string,"https://medi-store-nu.vercel.app"],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            phone: {
                type:"string",
               
                required:false
            }
        }
    }
    , cookies: {
    sessionToken: {
      name: "__Secure-better-auth.session_token",
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "none", 
      },
    },
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