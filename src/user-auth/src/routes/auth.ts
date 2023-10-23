import { Router } from "express"
import express from "express"
import { registerUser, loginUser, fetchUserById } from "../controllers/AuthController"

export const authRouter = Router()

authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.get("/user/:id", fetchUserById)