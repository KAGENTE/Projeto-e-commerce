import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, sku, stock } = req.body;
  const product = await prisma.product.create({
    data: { name, description, price: Number(price), sku, stock: Number(stock) }
  });
  res.status(201).json(product);
};
