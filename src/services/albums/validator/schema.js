import Joi from 'joi';

export const albumPlayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
});