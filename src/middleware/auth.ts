import { Request, Response, NextFunction } from "express";
import { auth as betterAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/prisma";
import { TypeUserRole } from "../types/userRole";

export const auth = (...allowedRoles: TypeUserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const session = await betterAuth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session?.user?.id) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          role: true,
          banned: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.banned) {
        res.status(403).json({ message: "Account suspended" });
        return;
      }

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role as TypeUserRole)
      ) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role as TypeUserRole,
        banned: user.banned as boolean,
      };

      next();
    } catch (err) {
      console.error("Auth error:", err);
      res.status(401).json({ message: "Authentication failed" });
    }
  };
};
