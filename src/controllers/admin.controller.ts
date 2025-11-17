import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../interfaces/req.interface";

const prisma = new PrismaClient();

export const AdminController = {
  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { id: "desc" },
      });
      return res.json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar pedidos." });
    }
  },

  // Listar todos os usuários
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { id: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar usuários." });
    }
  },

  async listByUserId(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "ID de usuário inválido." });
      }

      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { id: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });

      return res.json(orders);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar pedidos do usuário." });
    }
  },

  // Adicionar um produto
  async addProduct(req: Request, res: Response) {
    try {
      const { name, imgUrl, description, price, sku, stock } = req.body;

      if (!name || !price || !sku) {
        return res
          .status(400)
          .json({ error: "Campos obrigatórios: name, price, sku" });
      }

      const product = await prisma.product.create({
        data: {
          name,
          imgUrl,
          description,
          price,
          sku,
          stock: stock || 0,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar produto." });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      const { name, imgUrl, description, price, sku, stock } = req.body;

      const updated = await prisma.product.update({
        where: { id },
        data: {
          name,
          imgUrl,
          description,
          price,
          sku,
          stock,
        },
      });

      return res.json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar produto." });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido." });
      }
      console.log(id)
      await prisma.product.delete({
        where: { id },
      });

      return res.json({ message: "Produto excluído com sucesso." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao excluir produto." });
    }
  },
};
