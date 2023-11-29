import express from 'express';
import * as TaskController from '../controllers/TaskController';

export const taskRouter = express.Router();

// Task Routes
taskRouter.post('/create', TaskController.createTask);
taskRouter.get('/user/:user_id', TaskController.getTasksByUserId);
taskRouter.get('/:id', TaskController.getTaskById);
taskRouter.get('/category/:category_id', TaskController.fetchTasksByCategoryId);

// Category Routes
taskRouter.post('/category/create', TaskController.createCategory);
taskRouter.get('/category/user/:user_id', TaskController.getCategoriesByUserId);
taskRouter.get('/category/:id', TaskController.getCategoryById);

// Combined Routes
taskRouter.get('/categories-with-tasks/:user_id', TaskController.getCategoriesWithTasks);

