import { createSchema, Type, typedModel } from "ts-mongoose";

const FixtureSchema = createSchema({
  homeTeam: Type.objectId({ ref: "Team" }),
  awayTeam: Type.objectId({ ref: "Team" }),
  homeScore: Type.number({ default: 0 }),
  awayScore: Type.number({ default: 0 }),
  time: Type.string(),
  stadium: Type.string(),
  played: Type.optionalBoolean({ default: false })
});

export const Fixture = typedModel("Fixture", FixtureSchema);
