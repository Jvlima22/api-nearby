import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class UsersController {
  // Listar todos os usuários
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { name: "asc" },
      });

      return response.json(users);
    } catch (error) {
      next(error);
    }
  }
  
  // Verificar login de um usuário
  async login(request: Request, response: Response, next: NextFunction) {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      const { email, password } = loginSchema.parse(request.body);

      // Buscar o usuário pelo email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return response.status(404).json({ message: "Usuário não encontrado." });
      }

      // Verificar se a senha corresponde (considerando que não há bcrypt)
      if (password !== user.password) {
        return response.status(401).json({ message: "Senha incorreta." });
      }

      return response.json({
        message: "Login bem-sucedido",
        userId: user.id,
      });
    } catch (error) {
      next(error);
    }
  }

  // Criar um novo usuário
  async create(request: Request, response: Response, next: NextFunction) {
    const userSchema = z.object({
      name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
      username: z.string().min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres." }),
      email: z.string().email({ message: "Formato de e-mail inválido." }),
      password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
    });
  
    try {
      console.log("Recebendo dados:", request.body); // Verificar os dados recebidos
  
      const validatedData = userSchema.parse(request.body);
  
      // Verificar se o e-mail já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
  
      if (existingUser) {
        return response.status(400).json({ message: "E-mail já cadastrado." });
      }
  
      const user = await prisma.user.create({
        data: validatedData,
      });
  
      return response.status(201).json({ message: "Usuário criado com sucesso!", user });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
  
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          message: "Erro de validação",
          errors: error.errors,
        });
      }
  
      return response.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  }

  // Atualizar os dados de um usuário
  async update(request: Request, response: Response, next: NextFunction) {
    const userId = request.params.id;

    const userSchema = z.object({
      name: z.string().min(3).optional(),
      phone: z.string().min(10).optional(),
      image: z.string().optional(),
      cpf: z.string().length(11).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    });

    try {
      const validatedData = userSchema.parse(request.body);

      const user = await prisma.user.update({
        where: { id: userId },
        data: validatedData,
      });

      return response.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Deletar um usuário
  async delete(request: Request, response: Response, next: NextFunction) {
    const userId = request.params.id;

    try {
      await prisma.user.delete({
        where: { id: userId },
      });

      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export { UsersController };
