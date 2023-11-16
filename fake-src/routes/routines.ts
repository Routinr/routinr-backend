import { Router } from "express"
import express from "express"
import * as RoutineController from "../controllers/RoutineController"

export const routinesRouter = Router()

routinesRouter.get("/user/:user_id", RoutineController.getRoutinesByUserId)
routinesRouter.get("/view/:routine_id", RoutineController.getRoutineInfo)