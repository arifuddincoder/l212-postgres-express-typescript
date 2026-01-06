import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/login", auth("admin"), authController.loginUser);

export const authRoutes = router;
