import { Router } from "express";
import { login } from "../controllers/login";
import { signup } from "../controllers/signup";
import { signout } from "../controllers/signout";
import auth from "../middleware/auth";

const router = Router();

router
  .post("/signup", signup)
  .post("/login", login)
  .get("/signout", auth, signout);

export default router;
