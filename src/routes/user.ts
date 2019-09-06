import { Router } from "express";
import { login } from "../controllers/login";
import { signup } from "../controllers/signup";
import { signout } from "../controllers/signout";

const router = Router();

router
  .post("/signup", signup)
  .post("/login", login)
  .get("/signout", signout);

export default router;
