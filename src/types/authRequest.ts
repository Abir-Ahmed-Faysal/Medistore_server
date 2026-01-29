import { Request } from "express";
import { TypeUserRole } from "./userRole";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
    role: TypeUserRole;
    banned: boolean;
  };
}
