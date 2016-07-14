/* eslint-disable func-names, no-param-reassign, array-callback-return, max-len */
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Piece = require('./piece');

function createInitialGameBoard() {
  const temp = ['', '', '', '', '', '', '', ''];
  const board = temp.map(e => {
    return ['', '', '', '', '', '', '', ''];
  });
  board[0][0] = new Piece({ color: 'black', status: 'base' });
  board[2][0] = new Piece({ color: 'black', status: 'base' });
  board[4][0] = new Piece({ color: 'black', status: 'base' });
  board[6][0] = new Piece({ color: 'black', status: 'base' });
  board[1][1] = new Piece({ color: 'black', status: 'base' });
  board[3][1] = new Piece({ color: 'black', status: 'base' });
  board[5][1] = new Piece({ color: 'black', status: 'base' });
  board[7][1] = new Piece({ color: 'black', status: 'base' });
  board[0][2] = new Piece({ color: 'black', status: 'base' });
  board[2][2] = new Piece({ color: 'black', status: 'base' });
  board[4][2] = new Piece({ color: 'black', status: 'base' });
  board[6][2] = new Piece({ color: 'black', status: 'base' });
  board[1][5] = new Piece({ color: 'white', status: 'base' });
  board[3][5] = new Piece({ color: 'white', status: 'base' });
  board[5][5] = new Piece({ color: 'white', status: 'base' });
  board[7][5] = new Piece({ color: 'white', status: 'base' });
  board[0][6] = new Piece({ color: 'white', status: 'base' });
  board[2][6] = new Piece({ color: 'white', status: 'base' });
  board[4][6] = new Piece({ color: 'white', status: 'base' });
  board[6][6] = new Piece({ color: 'white', status: 'base' });
  board[1][7] = new Piece({ color: 'white', status: 'base' });
  board[3][7] = new Piece({ color: 'white', status: 'base' });
  board[5][7] = new Piece({ color: 'white', status: 'base' });
  board[7][7] = new Piece({ color: 'white', status: 'base' });
  return board;
}

function completeTurn(game) {
  game.currentPlayer = (game.currentPlayer % 2) + 1;
  let p1 = 0;
  let p2 = 0;
  game.gameBoard.map(a => a.map(p => {
    if (p === '') return;
    if (p.color === 'white') {
      p1++;
    } else {
      p2++;
    }
  }));
  if (p1 === 0) {
    game.winner = 2;
  }
  if (p2 === 0) {
    game.winner = 1;
  }
}

const gameSchema = new Schema({
  currentPlayer: { type: Number, default: 1 },
  player1: { type: mongoose.Schema.ObjectId, ref: 'player', required: true },
  player2: { type: mongoose.Schema.ObjectId, ref: 'player', required: true },
  gameBoard: { type: Array, default: createInitialGameBoard },
  winner: { type: Number, default: 0 },
});

function isMovementValid(obj, fromX, fromY, toX, toY, dist, player) {
  if ((fromX + fromY) % 2 !== 0 || (toX + toY) % 2 !== 0) {
    return new Error('not a valid move!');
  }
  if (Math.abs(fromX - toX) !== dist && Math.abs(fromY + toY) !== dist) {
    return new Error('not a valid move - too far');
  }

  if (obj.currentPlayer === 1 && fromY > toY && obj.gameBoard[fromX][fromY].status !== 'king') {
    return new Error('not a valid move - wrong direction');
  }

  if (obj.currentPlayer === 2 && fromY < toY && obj.gameBoard[fromX][fromY].status !== 'king') {
    return new Error('not a valid move - wrong direction');
  }

  if (obj.gameBoard[toX][toY] !== '') {
    return new Error('not a valid move - destination occupied');
  }

  if ((obj.currentPlayer === 1 && obj.player1.toString() !== player) ||
    (obj.currentPlayer === 2 && obj.player2.toString() !== player)) {
    return new Error('not a valid move - not your turn');
  }
  return null;
}

gameSchema.methods.move = function (fromX, fromY, toX, toY, player) {
  const err = isMovementValid(this, fromX, fromY, toX, toY, 1, player);
  if (err) {
    return err;
  }

  this.gameBoard[toX][toY] = this.gameBoard[fromX][fromY];
  this.gameBoard[fromX][fromY] = '';
  if (toY === 0 || toY === 7) {
    this.gameBoard[toX][toY].status = 'king';
  }
  completeTurn(this);
};

gameSchema.methods.jump = function(fromX, fromY, toX, toY, player) {
  const err = isMovementValid(this, fromX, fromY, toX, toY, 2, player);
  if (err) {
    return err;
  }
  if (this.gameBoard[(fromX + toX) / 2][(fromY + toY) / 2] !== '') {
    if (this.gameBoard[(fromX + toX) / 2][(fromY + toY) / 2].color !== this.gameBoard[fromX][fromY].color) {
      this.gameBoard[toX][toY] = this.gameBoard[fromX][fromY];
      this.gameBoard[fromX][fromY] = '';
      this.gameBoard[(fromX + toX) / 2][(fromY + toY) / 2] = '';
      if (toY === 0 || toY === 7) {
        this.gameBoard[toX][toY].status = 'king';
      }
      completeTurn(this);
    } else {
      return new Error('jump invalid - cant jump your own piece');
    }
  } else {
    return new Error('jump invalid - no piece to jump');
  }
};

module.exports = mongoose.model('Game', gameSchema);
