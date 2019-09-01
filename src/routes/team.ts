import { Router } from "express";
import {
  view_teams,
  create_teams,
  update_team,
  delete_team
} from "../controllers/teams";
const router = Router();

router
  .get("/api/view-teams/", view_teams)
  .post("/api/create-teams", create_teams)
  .put("/api/update-team/:id", update_team)
  .delete("/api/delete-team/:id", delete_team);

export default router;
