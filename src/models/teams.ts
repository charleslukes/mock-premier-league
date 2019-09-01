import { createSchema, Type, typedModel } from "ts-mongoose";

const TeamSchema = createSchema({
  name: Type.string(),
  email: Type.string(),
  coach: Type.string(),
  country: Type.string(),
  founded: Type.number(),
  stadium_name: Type.string(),
  stadium_capacity: Type.string()
});

export const Team = typedModel("Team", TeamSchema);
