import Joi from "joi";
import JoiObjectId from "joi-objectid";
const myJoiObjectId = JoiObjectId(Joi);

export const validateFixture = (input: object) => {
  const schema = {
    homeTeam: myJoiObjectId().required(),
    awayTeam: myJoiObjectId().required(),
    homeScore: Joi.number().required(),
    awayScore: Joi.number().required(),
    time: Joi.string(),
    stadium: Joi.string(),
    played: Joi.boolean().required()
  };

  return Joi.validate(input, schema);
};
