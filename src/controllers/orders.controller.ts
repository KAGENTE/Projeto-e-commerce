import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const OrderController = {

  // Criar pedido
  async create(req: Request, res: Response) {
    try {
      const { itens, total } = req.body;

      if (!Array.isArray(itens)) {
        return res.status(400).json({ error: "O campo 'itens' deve ser uma lista." });
      }

      if (typeof total !== "number") {
        return res.status(400).json({ error: "O campo 'total' deve ser um número." });
      }

      const order = await prisma.order.create({
        data: {
          itens: itens as Prisma.JsonValue, // <-- cast adicionado
          total,
        },
      });

      return res.status(201).json(order);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar pedido." });
    }
  },

  // Listar todos os pedidos
  async list(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { id: "desc" }
      });

      return res.json(orders);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar pedidos." });
    }
  },

  // Buscar pedido por ID
  async get(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      return res.json(order);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar pedido." });
    }
  }
};
