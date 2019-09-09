import { Router } from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import {
  view_teams,
  create_teams,
  update_team,
  delete_team
} from "../controllers/teams";
const router = Router();

router
  .get("/", auth, view_teams)
  .post("/",[auth, admin], create_teams)
  .put("/:id", [auth, admin], update_team)
  .delete("/:id",[auth, admin], delete_team);

export default router;
