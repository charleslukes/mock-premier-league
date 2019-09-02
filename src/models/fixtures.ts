import { createSchema, Type, typedModel } from "ts-mongoose";

const FixtureSchema = createSchema({
  homeTeam: Type.objectId(),
  awayTeam: Type.objectId(),
  homeScore: Type.number(),
  awayScore: Type.number(),
  time: Type.string(),
  stadium: Type.string(),
  played: Type.optionalBoolean({ default: false })
});

export const Fixture = typedModel("Fixture", FixtureSchema);
