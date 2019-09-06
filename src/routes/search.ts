import { Router } from "express";
import { searchTeam, searchFixture } from "../controllers/search";
const router = Router();

router.get("/team/:id", searchTeam).get("/fixtures/:id", searchFixture);

export default router;
