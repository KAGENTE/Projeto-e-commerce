import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  // Verifica se role é admin
  if (typeof user === "object" && user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }

  next();
}
