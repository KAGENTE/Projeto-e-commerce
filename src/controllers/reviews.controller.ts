import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

export const ReviewController = {
  // Criar review
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = typeof req.user === "object" && "id" in req.user ? req.user.id : null;
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const { productId, rating, comment } = req.body;

      if (!productId || rating === undefined || !comment) {
        return res.status(400).json({ error: "Campos obrigatórios: productId, rating, comment" });
      }

      if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: "Rating deve ser entre 0 e 5." });
      }

      const review = await prisma.review.create({
        data: {
          userId,
          productId,
          rating,
          comment,
        },
      });

      return res.status(201).json(review);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar review." });
    }
  },

  async listByProduct(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "productId inválido." });
      }

      const reviews = await prisma.review.findMany({
        where: { productId },
        include: { user: { select: { name: true } } }, // traz o nome do usuário
        orderBy: { createdAt: "desc" },
      });

      return res.json(reviews);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar reviews." });
    }
  },
};
