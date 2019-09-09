import { Router } from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import {
  view_fixtures,
  view_completed_fixtures,
  view_pending_fixtures,
  create_fixtures,
  update_fixture,
  delete_fixture,
  getFixture
} from "../controllers/fixtures";

const router = Router();
router
  .get("/", auth, view_fixtures)
  .get("/complete", auth, view_completed_fixtures)
  .get("/pend", auth, view_pending_fixtures)
  .get("/:id", auth, getFixture)
  .post("/", [auth, admin], create_fixtures)
  .put("/:id", [auth, admin], update_fixture)
  .delete("/:id", [auth, admin], delete_fixture);

export default router;
