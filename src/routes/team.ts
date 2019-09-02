import { Router } from "express";
import {
  view_teams,
  create_teams,
  update_team,
  delete_team
} from "../controllers/teams";
const router = Router();

router
  .get("/", view_teams)
  .post("/", create_teams)
  .put("/:id", update_team)
  .delete("/:id", delete_team);

export default router;
