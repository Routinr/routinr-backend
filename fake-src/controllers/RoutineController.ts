import User from "../models/User";
import Step from "../models/Step";
import Routine from "../models/Routine";
import { Request, Response } from "express";

export const getRoutinesByUserId = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;
        const routines = await Routine.getRoutinesByUserId(parseInt(user_id, 10));
        if (!routines) {
            return res.status(404).json({ error: "ROUTINES_NOT_FOUND" });
        }
        res.status(200).json(routines);
    } catch (error) {
        console.error("Error fetching routines:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export const getRoutineInfo = async (req: Request, res: Response) => {
    try {
        const { routine_id } = req.params;
        const routine = await Routine.getRoutineById(parseInt(routine_id, 10));
        if (!routine) {
            return res.status(404).json({ error: "ROUTINE_NOT_FOUND" });
        }
        const routineInfo = await routine.getRoutineInfo();
        res.status(200).json(routineInfo);
    } catch (error) {
        console.error("Error fetching routine info:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export const createRoutine = async (req: Request, res: Response) => {
    try {
        const { user_id, name, description, time_block } = req.body;
        // const old_routine = await Routine.getRoutineByIdentifier(name);
        const old_routine = null;
        
        if (!old_routine) {
            const routine = await Routine.createRoutine(user_id, name, description, time_block);

            if (routine) {
                res.status(200).json({ message: "Routine created successfully" });
            } else {
                res.status(500).json({ error: "INTERNAL_FUNCTION_ERROR" });
            }
        } else {
            return res.status(409).json({error: "DUPLICATE_ROUTINE_ENTRY"});
        }
    } catch (error) {
        console.error("Error creating routine:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export const deleteRoutine = async (req: Request, res: Response) => {
    try {
        const { routine_id } = req.params;
        const routine = await Routine.getRoutineById(parseInt(routine_id, 10));

        if (routine) {
            await Routine.deleteRoutine(parseInt(routine_id, 10));
            res.status(200).json({ message: "Routine deleted successfully" });
        } else {
            res.status(404).json({ error: "Routine not found" });
        }
    } catch (error) {
        console.error("Error deleting routine:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export const updateRoutine = async (req: Request, res: Response) => {
    try {
        const { routine_id, updates } = req.body;
        const routine = await Routine.getRoutineById(parseInt(routine_id, 10));

        if (routine) {
            await Routine.updateRoutine(parseInt(routine_id, 10), updates);
            res.status(200).json({ message: "Routine deleted successfully" });
        } else {
            res.status(404).json({ error: "Routine not found" });
        }
    } catch (error) {
        console.error("Error updating routine:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

// create step
export const createStep = async (res: Response, req: Request) => {
    try {
        const { routine_id, name, icon, time_slot, description} = req.body;
        // old_step = Step.getStepByIdentifier(name);
        const old_step = null;
        
        if (!old_step) {
            const step = await Step.createStep(routine_id, name, icon, time_slot, description);

            if (step) {
                res.status(200).json({ message: "Step created successfully" });
            } else {
                res.status(404).json({ error: "Step not found" });
            }
        } else {
            return res.status(409).json({error: "DUPLICATE_STEP_ENTRY"});
        }
    } catch (error) {
        console.error("Error updating step:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

// update step
export const updateStep = async (req: Request, res: Response) => {
    try {
        const { step_id, updates } = req.body;
        const step = await Step.getStepById(parseInt(step_id, 10));

        if (step) {
            await Step.updateStep(parseInt(step_id, 10), updates);
            res.status(200).json({ message: "Step deleted successfully" });
        } else {
            res.status(404).json({ error: "Step not found" });
        }
    } catch (error) {
        console.error("Error updating step:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

// delete step
export const deleteStep = async (req: Request, res: Response) => {
    try {
        const { step_id } = req.params;
        const step = await Step.getStepById(parseInt(step_id, 10));

        if (step) {
            await Step.deleteStep(parseInt(step_id, 10));
            res.status(200).json({ message: "Step deleted successfully" });
        } else {
            res.status(404).json({ error: "Step not found" });
        }
    } catch (error) {
        console.error("Error deleting step:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

// get all steps
export const getStepsByRoutineId = async (req: Request, res: Response) => {
    try {
        const { routine_id } = req.params;
        const steps = await Step.getStepsByRoutineId(parseInt(routine_id, 10));
        if (!steps) {
            return res.status(404).json({ error: "STEPS_NOT_FOUND" });
        }
        res.status(200).json(steps);
    } catch (error) {
        console.error("Error fetching steps:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

// get step details
export const getStepDetails = async (req: Request, res: Response) => {
    try {
        const { step_id } = req.params;
        const step = await Step.getStepById(parseInt(step_id, 10));
        if (!step) {
            return res.status(404).json({ error: "STEP_NOT_FOUND" });
        }
        res.status(200).json(step);
    } catch (error) {
        console.error("Error fetching routine info:", error);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}