import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { TypeUserRole } from "../types/userRole";





export const auth = (...roles: TypeUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      console.log("hit the first check");
      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as TypeUserRole,
      };




      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }
      console.log("hit the final check");
      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
  };
};
