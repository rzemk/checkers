/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  name: joi.string().required().min(3),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send({ messages: result.error.details.map(d => d.message) });
  } else {
    next();
  }
};
