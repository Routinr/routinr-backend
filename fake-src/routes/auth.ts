import { Router } from "express"
import express from "express"
import { registerUser, loginUser, fetchUserById, startVerifyUserEmail, endVerifyUserEmail, forgotPassword, resetPassword } from "../controllers/AuthController"

export const authRouter = Router()

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post('/verify-user-email/start', startVerifyUserEmail);
authRouter.post('/verify-user-email/end', endVerifyUserEmail);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.get("/user/:id", fetchUserById)