import { Request, Response } from "express";

export const getCurrentUser = (req: Request, res: Response) => {
  
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  
  const { id, email, name, role, banned } = req.user;
  return res.status(200).json({ id, email, name, role, banned });
};
