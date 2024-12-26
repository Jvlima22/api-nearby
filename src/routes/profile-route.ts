import { Router } from "express";
import { ProfileController } from "@/controllers/profile-controller";

const profileRoutes = Router();
const profileController = new ProfileController();

// Rota para visualizar a imagem de perfil
profileRoutes.get("/:user_id/profile-image", profileController.getProfileImage);

// Rota para atualizar a imagem de perfil
profileRoutes.put("/:user_id/profile-image", profileController.updateProfileImage);

// Nova rota para buscar todos os dados do usuário logado
profileRoutes.get("/:user_id", profileController.getUserProfile);

export { profileRoutes };
