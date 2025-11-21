import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";
import { OpenRouterResponse } from "../interfaces/OpenRouterResponse";

const prisma = new PrismaClient();

export const generateReviewSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) return res.status(400).json({ error: "ID inválido" });

    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { comment: true },
    });

    const allText = reviews.map((r) => r.comment).join("\n");

    // garante que req.body seja um objeto
    req.body = req.body || {};

    if (!allText) {
      req.body.reviewSummary = "Sem reviews ainda.";
      return next();
    }

    const prompt = `
Você é um assistente que resume avaliações de produtos. Gere **um resumo único em português**, apenas com:
- Pontos positivos
- Pontos negativos
Não inclua frases de conclusão, números ou instruções. Apenas o texto do resumo.
não inclua nenhum tipo de simbolo na resposta

Reviews do produto:
${allText}
`;


    const response = await fetch("https://openrouter.ai/api/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e2b-it:free",
        prompt: prompt,
        max_tokens: 300,
      }),
    });

    const rawData = await response.json();
    console.log("Raw OpenRouter response:", rawData);

    const data = rawData as OpenRouterResponse;

    req.body.reviewSummary = data?.choices?.[0]?.text?.trim() || "Não foi possível gerar resumo.";

    next(); // Passa para o controller
  } catch (err) {
    console.error(err);
    req.body = req.body || {};
    req.body.reviewSummary = "Erro ao gerar resumo.";
    next();
  }
};
