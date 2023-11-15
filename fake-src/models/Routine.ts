import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import Step from './Step';

import sequelize from '../config/db';


class Routine extends Model {
    private id!: number;
    private user_id!: number;
    private name!: string;
    private description!: string;
    private time_block!: string;

    static associate(models: any) {
        Routine.hasMany(models.Step, {
            foreignKey: 'routine_id',
            as: 'steps'
        });
        Routine.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        })
    }

    
    /**
     * Creates a new routine for a user.
     *
     * @param {number} user_id - The ID of the user.
     * @param {string} name - The name of the routine.
     * @param {string} description - The description of the routine.
     * @param {string} time_block - The time block of the routine. Defaults to '0h'.
     * @return {Promise<Routine | null>} A promise that resolves with the created routine or null if an error occurred.
     */
    public static async createRoutine(user_id: number, name: string, description: string, time_block: string = '0h'): Promise<Routine | null> {
        try {
            const newRoutine = await Routine.create({
                user_id,
                name,
                description,
                time_block
            });
            return newRoutine;
        } catch (error: any) {
            console.log(error);
            return null;
        }
    }
    
    /**
     * Retrieves the routines associated with a specific user.
     *
     * @param {number} user_id - The ID of the user.
     * @return {Promise<Routine[] | null>} The routines associated with the user, or null if there was an error.
     */
    public static async getRoutinesByUserId(user_id: number): Promise<Routine[] | null> {
        try {
            const routines = await Routine.findAll({
                where: {
                    user_id
                }
            });
            return routines;
        } catch (error: any) {
            console.log("Error fetching routines: ", error)
            return null;
        }
    }

    /**
     * Retrieves routine information.
     *
     * @return {Promise<Routine | null>} The routine information or `null` if an error occurred.
     */
    public async getRoutineInfo(): Promise<Routine | null> {
        try {
            const routine = await Routine.findByPk(this.id, {
                include: [{
                    model: Step,
                    as: 'steps'
                }]
            });
            return routine;
        } catch (error: any) {
            console.log("Error fetching routine: ", error)
            return null;
        }
    }

    /**
     * Updates a routine by its ID with the given updates.
     *
     * @param {number} id - The ID of the routine to update.
     * @param {Partial<Routine>} updates - The updates to apply to the routine.
     * @return {Promise<Routine | null>} A promise that resolves to the updated routine, or null if the routine does not exist.
     */
    public static async updateRoutine(id: number, updates: Partial<Routine>): Promise<Routine | null> {
        try {
            const routine = await Routine.findByPk(id);
            if (routine) {
                await routine.update(updates);
                return routine;
            }
            return null;
        } catch (error: any) {
            console.log("Error updating routine: ", error);
            return null;
        }
    }

    public static async getRoutineById(id: number): Promise<Routine | null> {
        try {
            const routine = await Routine.findByPk(id);
            return routine;
        } catch (error: any) {
            console.log("Error fetching routine: ", error)
            return null;
        }
    }

    /**
     * Deletes a routine with the given ID.
     *
     * @param {number} id - The ID of the routine to be deleted.
     * @return {Promise<boolean>} A boolean indicating whether the routine was successfully deleted.
     */
    public static async deleteRoutine(id: number): Promise<boolean> {
        try {
            const routine = await Routine.findByPk(id);
            if (routine) {
                await routine.destroy();
                return true;
            }
            return false;
        } catch (error: any) {
            console.log("Error deleting routine: ", error);
            return false;
        }
    }

    /**
     * Retrieves a routine by its ID.
     *
     * @param {number} id - The ID of the routine.
     * @return {Promise<Routine | null>} The routine matching the ID, or null if not found.
     */
    public async getRoutineById(id: number): Promise<Routine | null> {
        try {
            const routine = await Routine.findByPk(id, {
                include: [
                    {
                        model: Step,
                        as: 'steps'
                    }
                ]
            });
            return routine;
        } catch (error) {
            console.error('Error fetching routine by id:', error);
            return null;
        }
    }
}
    Routine.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        time_block: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Routine',
        tableName: 'routines',
      }
    );    
export default Routine;
