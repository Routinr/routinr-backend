import { Router } from "express"
import * as RoutineController from "../controllers/RoutineController"
import { tokenVerification } from "../controllers/AuthController"

export const routinesRouter = Router()

routinesRouter.get("/user/:user_id", tokenVerification, RoutineController.getRoutinesByUserId)
routinesRouter.get("/view/:routine_id", tokenVerification, RoutineController.getRoutineInfo)
routinesRouter.post("/create", tokenVerification, RoutineController.createRoutine)
routinesRouter.post("/delete/:routine_id", tokenVerification, RoutineController.deleteRoutine)
routinesRouter.put("/update", tokenVerification, RoutineController.updateRoutine)
routinesRouter.post("/step/add", tokenVerification, RoutineController.createStep)
routinesRouter.post("/step/delete/:step_id", tokenVerification, RoutineController.deleteStep)
routinesRouter.put("/step/update", tokenVerification, RoutineController.updateStep)
routinesRouter.get("/steps/:routine_id", tokenVerification, RoutineController.getStepsByRoutineId)
routinesRouter.get("/step/:step_id", tokenVerification, RoutineController.getStepDetails)