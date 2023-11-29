import Task from "../models/Task";
import Category from "../models/Category";
import { Request, Response } from "express";


export const createTask = async (req: Request, res: Response) => {
    try {
        const { name, user_id, category_id, priority, description, status, due_date } = req.body;
        const task = await Task.AddTask(name, user_id, category_id, priority, description, status, due_date);
        res.status(201).json(task);
    } catch (error) {
        console.log("Error creating task: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getTasksByUserId = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;
        const tasks = await Task.getTasksByUserId(parseInt(user_id, 10));
        if (!tasks) {
            return res.status(404).json({ error: "Tasks not found" });
        }
        res.status(200).json(tasks);
    } catch (error) {
        console.log("Error fetching tasks: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.getTaskById(parseInt(id, 10));
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        console.log("Error fetching task: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const fetchTasksByCategoryId = async (req: Request, res: Response) => {
    try {
        const { category_id } = req.params;
        const tasks = await Task.getTaskByCategoryId(parseInt(category_id, 10));
        if (!tasks) {
            return res.status(404).json({ error: "Tasks not found" });
        }
        res.status(200).json(tasks);
    } catch (error) {
        console.log("Error fetching tasks: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, user_id } = req.body;
        const category = await Category.create({ name, user_id });
        res.status(201).json(category);
    } catch (error) {
        console.log("Error creating category: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getCategoriesByUserId = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;
        const categories = await Category.getCategoriesByUserId(parseInt(user_id, 10));
        if (!categories) {
            return res.status(404).json({ error: "Categories not found" });
        }
        res.status(200).json(categories);
    } catch (error) {
        console.log("Error fetching categories: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.getCategoryById(parseInt(id, 10));
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        console.log("Error fetching category: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getCategoriesWithTasks = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;
        const categories = await Category.getCategoryWithTasks(parseInt(user_id, 10));
        res.status(200).json(categories);
    } catch (error) {
        console.log("Error fetching categories: " + error);
        res.status(500).json({ error: "Internal server error" });
    }
}