import { Router } from "express";
import {
  view_fixtures,
  create_fixtures,
  getFixture
} from "../controllers/fixtures";

const router = Router();
router
  .get("/", view_fixtures)
  .get("/one", getFixture)
  .post("/", create_fixtures);

export default router;
