import { Router } from "express";
import { login } from "../controllers/login";
import { signup } from "../controllers/signup";
const router = Router();

router.post("/api/user/signup", signup).post("/api/user/login", login);

export default router;
