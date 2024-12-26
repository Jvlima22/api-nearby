import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class ProfileController {
  // Buscar todos os dados do usuário logado
  async getUserProfile(request: Request, response: Response) {
    try {
      const { user_id } = request.params; 

      const user = await prisma.user.findUnique({
        where: { id: user_id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          phone: true,
          image: true,
          cover: true,
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return response.status(200).json({ user });
    } catch (error: any) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }

      if (error instanceof Error) {
        return response.status(500).json({ message: error.message });
      }

      return response.status(500).json({ message: "Unknown error occurred" });
    }
  }

  // Exibir a imagem de perfil do usuário logado
  async getProfileImage(request: Request, response: Response) {
    try {
      const { user_id } = request.params;

      const user = await prisma.user.findUnique({
        where: { id: user_id },
        select: { image: true },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return response.status(200).json({ imageUrl: user.image });
    } catch (error: any) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }

      if (error instanceof Error) {
        return response.status(500).json({ message: error.message });
      }

      return response.status(500).json({ message: "Unknown error occurred" });
    }
  }

  // Atualizar a imagem de perfil
  async updateProfileImage(request: Request, response: Response) {
    try {
      const { user_id } = request.params;
      const { image } = request.body;

      if (!image) {
        throw new AppError("Image URL is required", 400);
      }

      const user = await prisma.user.update({
        where: { id: user_id },
        data: { image },
      });

      return response.status(200).json({ message: "Image updated successfully", imageUrl: user.image });
    } catch (error: any) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
      }

      if (error instanceof Error) {
        return response.status(500).json({ message: error.message });
      }

      return response.status(500).json({ message: "Unknown error occurred" });
    }
  }
}

export { ProfileController };
