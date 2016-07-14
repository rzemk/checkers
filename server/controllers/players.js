/* eslint-disable new-cap */
import express from 'express';
import Player from '../models/player';
const router = module.exports = express.Router();
import bodyValidator from '../validators/players/body';

router.post('/', bodyValidator, (req, res) => {
  const player = new Player(req.body);
  player.save(error => {
    res.send({ error, player });
  });
});
