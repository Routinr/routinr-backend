import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

import sequelize from '../config/db';

class Step extends Model {
    private id!: number;
    private routine_id!: number;
    private name!: string;
    private icon!: string;
    private time_slot!: string;
    private description!: string;

    static associate(models: any) {
        Step.belongsTo(models.Routine, {
            foreignKey: 'routine_id',
            as: 'routine'
        });
    }

    /**
     * Creates a new step with the given properties.
     *
     * @param {string} name - The name of the step.
     * @param {number} routine_id - The ID of the routine the step belongs to.
     * @param {string} icon - The icon of the step.
     * @param {string} time_slot - The time slot of the step.
     * @param {string} description - The description of the step.
     * @return {Promise<Step | null>} The newly created step, or null if there was an error.
     */
    public async createStep(name: string, routine_id: number, icon: string, time_slot: string, description: string): Promise<Step | null> {
        try {
            const newStep = await Step.create({
                routine_id,
                name,
                icon,
                time_slot,
                description
            });
            return newStep;
        } catch (error: any) {
            console.log(error);
            return null;
        }
    }

    /**
     * Retrieves steps by routine ID.
     *
     * @param {number} routine_id - The ID of the routine.
     * @return {Promise<Step[] | null>} - A promise that resolves to an array of steps or null if an error occurs.
     */
    public async getStepsByRoutineId(routine_id: number): Promise<Step[] | null> {
        try {
            const steps = await Step.findAll({
                where: {
                    routine_id
                }
            });
            return steps;
        } catch (error: any) {
            console.log("Error fetching steps: ", error)
            return null;
        }
    }
/**
 * Updates a step by ID with the given updates.
 *
 * @param {number} id - The ID of the step to update.
 * @param {Partial<Step>} updates - The updates to apply to the step.
 * @return {Promise<Step | null>} - The updated step, or null if the step does not exist.
 */
public async updateStep(id: number, updates: Partial<Step>): Promise<Step | null> {
    try {
        const step = await Step.findByPk(id);
        if (step) {
            await step.update(updates);
            return step;
        }
        return null;
    } catch (error: any) {
        console.log("Error updating step: ", error);
        return null;
    }
}

public async deleteStep(id: number): Promise<boolean> {
    try {
        const step = await Step.findByPk(id);
        if (step) {
            await step.destroy();
            return true;
        }
        return false;
    } catch (error: any) {
        console.log("Error deleting step: ", error);
        return false;
    }
}

/**
 * Retrieves a step by its ID.
 *
 * @param {number} id - The ID of the step to retrieve.
 * @return {Promise<Step | null>} A promise that resolves to the retrieved step, or null if it does not exist.
 */
public async getStepById(id: number): Promise<Step | null> {
    try {
        const step = await Step.findByPk(id);
        return step;
    } catch (error: any) {
        console.log("Error fetching step by ID: ", error);
        return null;
    }
}

}

Step.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    routine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time_slot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'steps',
    modelName: 'Step',
    sequelize,
  }
);

export default Step;