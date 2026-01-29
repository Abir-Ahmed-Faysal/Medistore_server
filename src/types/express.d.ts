import "express";
import { TypeUserRole } from "./userRole";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role: TypeUserRole;
        banned?:boolean
      };
    }
  }
}
