import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

export const validateFixture = (input: object) => {
  const schema = {
    homeTeam: myJoiObjectId().required(),
    awayTeam: myJoiObjectId().required(),
    homeScore: Joi.number(),
    awayScore: Joi.number(),
    time: Joi.number(),
    stadium: Joi.string(),
    played: Joi.boolean()
  };

  return Joi.validate(input, schema);
};
