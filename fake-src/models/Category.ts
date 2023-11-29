import { DataTypes, Model } from 'sequelize';
import Task from './Task';
import sequelize from '../config/db';


class Category extends Model {
    id!: number;
    user_id!: number;
    name!: string;
    num_tasks!: number;

    static associate(models: any) {
        Category.belongsTo(models.User, { foreignKey: 'user_id' });
        Category.hasMany(models.Task, { foreignKey: 'category_id' });
    }

    /**
     * Adds a new category with the specified name and user ID.
     *
     * @param {string} name - The name of the category.
     * @param {number} user_id - The ID of the user who is adding the category.
     * @return {Promise<Category | null>} A Promise that resolves to the newly created category, or null if an error occurred.
     */
    public static async AddCategory(name: string, user_id: number): Promise<Category | null> {
        try {
            const result = await Category.create({ name, user_id });
            return result;
        } catch (error) {
            console.log("Error adding category: " + error);
            return null;
        }
    }

    /**
     * Retrieves categories by user ID.
     *
     * @param {number} user_id - The ID of the user.
     * @return {Promise<Category[] | null>} The categories associated with the user, or null if an error occurs.
     */
    public static async getCategoriesByUserId(user_id: number): Promise<Category[] | null> {
        try {
            const result = await Category.findAll({ where: { user_id } });
            return result;
        } catch (error) {
            console.log("Error fetching categories: " + error);
            return null;
        }
    }

    /**
     * Retrieves a category by its ID.
     *
     * @param {number} id - The ID of the category.
     * @return {Promise<Category | null>} A promise that resolves to the category object if found, or null if not found.
     */
    public static async getCategoryById(id: number): Promise<Category | null> {
        try {
            const result = await Category.findByPk(id);
            return result;
        } catch (error) {
            console.log("Error fetching category: " + error);
            return null;
        }
    }


    /**
     * Updates a category with the given ID using the provided updates.
     *
     * @param {number} id - The ID of the category to update.
     * @param {Partial<Category>} updates - The partial category object containing the updates.
     * @return {Promise<Category | null>} A promise that resolves to the updated category or null if an error occurred.
     */
    public async updateCategory(id: number, updates: Partial<Category>): Promise<Category | null> {
        try {
            await Category.update(updates, { where: { id } });
            const updatedCategory = await Category.findByPk(id);
            return updatedCategory || null;
        } catch (error) {
            console.log("Error updating category: " + error);
            return null;
        }
    }
    /**
     * Deletes a category by its ID.
     *
     * @param {number} id - The ID of the category to be deleted.
     * @return {Promise<void>} - A promise that resolves when the category is deleted successfully or rejects with an error if there was a problem.
     */
    public async deleteCategory(id: number): Promise<void> {
        try {
            await Category.destroy({ where: { id } });
        } catch (error) {
            console.log("Error deleting category: " + error);
        }
    }

    public static async getCategoryWithTasks(id: number): Promise<Category | null> {
        try {
            const result = await Category.findByPk(id, { include: [Task] });
            return result;
        } catch (error) {
            console.log("Error fetching category with tasks: " + error);
            return null;
    }
        
    }

}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        num_tasks: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: false
    }
)

export default Category