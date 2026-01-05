import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/login", auth(), authController.loginUser);

export const authRoutes = router;
