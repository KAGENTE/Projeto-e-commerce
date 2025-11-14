import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

export const OrderController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const userId =
        typeof req.user === "object" && "id" in req.user ? req.user.id : null;

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
      }

      const { itens, total } = req.body;

      if (!Array.isArray(itens)) {
        return res.status(400).json({ error: "O campo 'itens' deve ser uma lista." });
      }
      if (typeof total !== "number") {
        return res.status(400).json({ error: "O campo 'total' deve ser um número." });
      }

      const order = await prisma.order.create({
        data: {
          userId, 
          itens,
          total,
        },
      });

      return res.status(201).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar pedido." });
    }
  },

  async list(req: AuthRequest, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        include: { user: { select: { id: true, name: true, email: true } } }, // traz info do usuário
        orderBy: { id: "desc" },
      });

      return res.json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar pedidos." });
    }
  },

  async get(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      const order = await prisma.order.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      return res.json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar pedido." });
    }
  },
};
