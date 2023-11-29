import { DataTypes, Model } from 'sequelize';
import Category from './Category';
import sequelize from '../config/db';

class Task extends Model {

    id!: number;
    user_id!: number;
    name!: string;
    priority!: string;
    category_id!: number;
    description!: string;
    status!: string;
    due_date!: number;

    static associate(models: any) {
        Task.belongsTo(models.User, { foreignKey: 'user_id' });
        Task.belongsTo(models.Category, { foreignKey: 'category_id' });
    }

    /**
     * Adds a new task to the database.
     *
     * @param {string} name - The name of the task.
     * @param {number} user_id - The ID of the user who owns the task.
     * @param {number} category_id - The ID of the category the task belongs to.
     * @param {string} priority - The priority of the task.
     * @param {string} description - The description of the task.
     * @param {string} status - The status of the task.
     * @param {number} due_date - The due date of the task.
     * @return {Promise<Task | null>} A promise that resolves to the newly created task object or null if there was an error.
     */
    public static async AddTask(name: string, user_id: number, category_id: number, priority: string, description: string, status: string, due_date: number): Promise<Task | null> {
        try {
            const result = await Task.create({ name, user_id, category_id, priority, description, status, due_date });
            return result;
        } catch (error) {
            console.log("Error adding task: " + error);
            return null;
        }
    }

    /**
     * Retrieves tasks by user ID.
     *
     * @param {number} user_id - The ID of the user.
     * @return {Promise<Task[] | null>} The tasks associated with the user, or null if an error occurs.
     */
    public static async getTasksByUserId(user_id: number): Promise<Task[] | null> {
        try {
            const result = await Task.findAll({ where: { user_id } });
            return result;
        } catch (error) {
            console.log("Error fetching tasks: " + error);
            return null;
        }
    }

    /**
     * Retrieves a task by its ID.
     *
     * @param {number} id - The ID of the task to retrieve.
     * @return {Promise<Task | null>} A promise that resolves with the retrieved task, or null if no task is found.
     */
    public static async getTaskById(id: number): Promise<Task | null> {
        try {
            const result = await Task.findByPk(id);
            return result;
        } catch (error) {
            console.log("Error fetching task: " + error);
            return null;
        }
    }

    /**
     * Updates a task with the given ID using the provided updates.
     *
     * @param {number} id - The ID of the task to be updated.
     * @param {Partial<Task>} updates - The updates to be applied to the task.
     * @return {Promise<Task | null>} A Promise that resolves to the updated task or null if an error occurs.
     */
    public async updateTask(id: number, updates: Partial<Task>): Promise<Task | null> {
        try {
            await Task.update(updates, { where: { id } });
            const updatedTask = await Task.findByPk(id);
            return updatedTask || null;
        } catch (error) {
            console.log("Error updating task: " + error);
            return null;
        }
    }

    /**
     * Retrieves tasks by category ID.
     *
     * @param {number} category_id - The ID of the category.
     * @return {Promise<Task[] | null>} A promise that resolves to an array of tasks or null if an error occurs.
     */
    public static async getTaskByCategoryId(category_id: number): Promise<Task[] | null> {
        try {
            const result = Task.findAll({ where: { category_id } });
            return result;
        } catch (error) {
            console.log("Error fetching tasks: " + error);
            return null;
        }
    }

    /**
     * Deletes a task with the specified ID.
     *
     * @param {number} id - The ID of the task to delete.
     * @return {Promise<void>} - A promise that resolves when the task is deleted.
     */
    public async deleteTask(id: number): Promise<void> {
        try {
            await Task.destroy({ where: { id } });
        } catch (error) {
            console.log("Error deleting task: " + error);
        }
    }
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING
        },
        priority: {
            type: DataTypes.STRING
        },
        category_id: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING
        },
    }, {
        sequelize,
        tableName: 'tasks',
        timestamps: false   
    }
)

export default Task