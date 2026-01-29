import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { TypeUserRole } from "../types/userRole";

export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
 
    if (!req?.user || !req.user.email) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }


    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        role: true,
        banned: true, 
      },
    });

    if (!dbUser) {
      return res.status(401).json({ message: "User not found" });
    }

    if (dbUser.banned) {
      return res.status(403).json({
        message: "Your account has been banned",
      });
    }



    req.user = {
  ...req.user,
  role: dbUser.role as TypeUserRole,
  banned: dbUser.banned as boolean,   
  id: dbUser.id,
};

    next();
  } catch (error) {
    console.error("loadUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
