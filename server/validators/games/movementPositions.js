/* eslint-disable consistent-return, no-param-reassign, newline-per-chained-call */

import joi from 'joi';

const schema = {
  fromX: joi.number().required().min(0).max(7),
  fromY: joi.number().required().min(0).max(7),
  toX: joi.number().required().min(0).max(7),
  toY: joi.number().required().min(0).max(7),
  player: joi.string().required().regex(/^[0-9a-f]{24}$/),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    res.locals = result.value;
    next();
  }
};
