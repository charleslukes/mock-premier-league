import Joi from "joi";

export const validateUser = (input: object) => {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  };

  return Joi.validate(input, schema);
};
