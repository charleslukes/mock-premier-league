import { createSchema, Type, typedModel } from "ts-mongoose";

const FixtureSchema = createSchema({
  homeTeam: Type.objectId(),
  awayTeam: Type.objectId(),
  homeScore: Type.number({ default: 0 }),
  awayScore: Type.number({ default: 0 }),
  time: Type.string(),
  stadium: Type.string(),
  played: Type.optionalBoolean({ default: false })
});

export const Fixture = typedModel("Fixture", FixtureSchema);
