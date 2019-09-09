import { createSchema, Type, typedModel } from "ts-mongoose";
import shortid from "shortid";

const FixtureSchema = createSchema({
  homeTeam: Type.objectId({ ref: "Team" }),
  awayTeam: Type.objectId({ ref: "Team" }),
  homeScore: Type.number({ default: 0 }),
  awayScore: Type.number({ default: 0 }),
  time: Type.string(),
  stadium: Type.string(),
  played: Type.optionalBoolean({ default: false }),
  link: Type.mixed({
    default: () =>
      `http://localhost:${
        process.env.PORT
      }/api/v1/fixtures/${shortid.generate()}`
  })
});

export const Fixture = typedModel("Fixture", FixtureSchema);
