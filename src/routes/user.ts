import { Router } from "express";
import { login } from "../controllers/login";
import { signup } from "../controllers/signup";
const router = Router();

router.post("/signup", signup).post("/login", login);

export default router;
