/* eslint-disable new-cap, max-len */
import express from 'express';
import Game from '../models/game';
const router = module.exports = express.Router();
import movementPositionValidator from '../validators/games/movementPositions';
import paramValidator from '../validators/games/params';

router.post('/', (req, res) => {
  const game = new Game(req.body);
  game.save(err => {
    res.send({ game });
  });
});

router.put('/:id/move', paramValidator, movementPositionValidator, (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    let error = game.move(res.locals.fromX, res.locals.fromY, res.locals.toX, res.locals.toY, res.locals.player);
    if (!error) {
      error = '';
    }
    game.markModified('gameBoard');
    game.save((err) => {
      res.send({ error: error.message, game });
    });
  });
});

router.put('/:id/jump', paramValidator, movementPositionValidator, (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    let error = game.jump(res.locals.fromX, res.locals.fromY, res.locals.toX, res.locals.toY, res.locals.player)
    if (!error) {
      error = '';
    }
    game.markModified('gameBoard');
    game.save(() => {
      res.send({ error: error.message, game });
    });
  });
});
