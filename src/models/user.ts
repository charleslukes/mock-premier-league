import { createSchema, Type, typedModel } from "ts-mongoose";
import jwt from "jsonwebtoken";

const UserSchema = createSchema({
  name: Type.string(),
  email: Type.string({ unque: true }),
  password: Type.string(),
  isAdmin: Type.optionalBoolean(),
  ...({} as {
    getAuthToken: () => string;
  })
});

UserSchema.methods.getAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

export const User = typedModel("User", UserSchema);
