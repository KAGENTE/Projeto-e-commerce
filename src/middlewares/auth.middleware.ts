import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
  userId?: number; // adicionamos isso para usar nos controllers
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Server misconfiguration: JWT_SECRET missing" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = decoded;

    // Corrigido: salvar userId como número, pois seus controllers usam isso
    if (decoded && decoded.id) {
      req.userId = Number(decoded.id);
    } else {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
