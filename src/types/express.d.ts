// src/types/express.d.ts
import "express";
import { UserRole } from "../constant/Role";
import { UserStatus } from "../constant/userStatus";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role: UserRole;
        status: UserStatus;
      };
    }
  }
}
