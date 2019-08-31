import { createSchema, Type, typedModel } from "ts-mongoose";

const UserSchema = createSchema({
  name: Type.string(),
  email: Type.string({ unque: true }),
  password: Type.string(),
  isAdmin: Type.optionalBoolean()
});

UserSchema.methods.getAuthToken = () => {};
export const User = typedModel("User", UserSchema);
