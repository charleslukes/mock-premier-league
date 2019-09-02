import fixturesRouter from "./fixture";
import teamRouter from "./team";
import userRouter from "./user";
import { Router } from "express";

const router = Router();
router.use("/fixtures", fixturesRouter);
router.use("/teams", teamRouter);
router.use("/users", userRouter);

export default router;
