import { createSchema, Type, typedModel } from "ts-mongoose";
import { Team } from "./teams";

const FixtureSchema = createSchema({
  home: Type.schema().of(Team),
  away: Type.schema().of(Team),
  date: Type.date(),
  score: Type.optionalObject(),
  stadium: Type.string(),
  played: Type.optionalBoolean()
});

export const Fixture = typedModel("Fixture", FixtureSchema);
