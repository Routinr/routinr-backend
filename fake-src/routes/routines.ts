import { Router } from "express"
import express from "express"
import * as RoutineController from "../controllers/RoutineController"

export const routinesRouter = Router()

routinesRouter.get("/user/:user_id", RoutineController.getRoutinesByUserId)
routinesRouter.get("/view/:routine_id", RoutineController.getRoutineInfo)
routinesRouter.post("/create", RoutineController.createRoutine)
routinesRouter.post("/delete/:routine_id", RoutineController.deleteRoutine)
routinesRouter.put("/update", RoutineController.updateRoutine)
routinesRouter.post("/step/add", RoutineController.createStep)
routinesRouter.post("/step/delete/:step_id", RoutineController.deleteStep)
routinesRouter.put("/step/update", RoutineController.updateStep)
routinesRouter.get("/steps/:routine_id", RoutineController.getStepsByRoutineId)
routinesRouter.get("/step/:step_id", RoutineController.getStepDetails)