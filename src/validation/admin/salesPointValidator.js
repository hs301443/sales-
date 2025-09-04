import Joi from "joi";

const approveSaleSchema = Joi.object().keys({
  points: Joi.number().required().min(1).max(1000).label('Points')
});

export { approveSaleSchema };