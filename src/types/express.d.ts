import "express";
import { TypeUserRole } from "./userRole";
import { TypeUserStatus } from "./userStatus";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role: TypeUserRole;
        status: TypeUserStatus;
      };
    }
  }
}
