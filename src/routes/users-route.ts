import { UsersController } from '@/controllers/users-controller';
import { Router } from 'express';

const usersRoutes = Router();
const usersController = new UsersController();

// Rota para listar todos os usuários
usersRoutes.get('/', usersController.index);

// Rota para criar um novo usuário
usersRoutes.post('/signup', usersController.create);

// Rota para atualizar dados de um usuário
usersRoutes.put('/:id', usersController.update);

// Rota para deletar um usuário
usersRoutes.delete('/:id', usersController.delete);

// Rota para verificar login de um usuário (email e senha)
usersRoutes.post('/signin', usersController.login);

export { usersRoutes };
