import { createSchema, Type, typedModel } from "ts-mongoose";

const TeamSchema = createSchema({
  name: Type.string(),
  team_email: Type.string(),
  coach: Type.string(),
  country: Type.string(),
  founded: Type.number(),
  stadium_name: Type.string(),
  stadium_capacity: Type.string()
});

export const User = typedModel("Team", TeamSchema);
