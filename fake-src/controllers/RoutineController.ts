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