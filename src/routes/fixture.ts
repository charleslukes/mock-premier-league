import { Router } from "express";
import {
  view_fixtures,
  create_fixtures,
  update_fixture,
  delete_fixture,
  getFixture
} from "../controllers/fixtures";

const router = Router();
router
  .get("/", view_fixtures)
  .get("/one", getFixture)
  .post("/", create_fixtures)
  .put("/:id", update_fixture)
  .delete("/:id", delete_fixture);

export default router;
