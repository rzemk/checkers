/* eslint-disable no-unused-expressions, no-underscore-dangle, no-return-assign, no-unused-vars, max-len */
const expect = require('chai').expect;
const sinon = require('sinon');
const Game = require('../../dst/models/game');
const Player = require('../../dst/models/player');

const player1 = new Player({ name: 'Sam' });
const player2 = new Player({ name: 'George' });


describe('game', () => {
  beforeEach(() => {
    sinon.stub(Game, 'find').yields(null, []);
  });
  afterEach(() => {
    Game.find.restore();
  });
  describe('constructor', () => {
    it('should create a new game', (done) => {
      const game = new Game({ player1, player2 });
      game.validate((err) => {
        expect(err).to.be.undefined;
        expect(game).to.be.ok;
        done();
      });
    });
  });
  describe('#move', () => {
    it('should move a piece', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[2][2] = { _id: 'abc', color: 'white' };
      const err = game.move(2, 2, 3, 3, player1._id.toString());
      expect(game).to.be.ok;
      expect(game.gameBoard[3][3]._id).to.equal('abc');
    });
    it('should move a piece - and king the mover', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[6][6] = { _id: 'abc', color: 'white' };
      const err = game.move(6, 6, 7, 7, player1._id.toString());
      expect(game).to.be.ok;
      expect(game.gameBoard[7][7]._id).to.equal('abc');
      expect(game.gameBoard[7][7].status).to.equal('king');
    });
    it('should not move a piece - invalid position', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[2][2] = { _id: 'abc', color: 'white' };
      const err = game.move(2, 2, 5, 4);
      expect(game).to.be.ok;
      expect(err.message).to.deep.equal('not a valid move!');
      expect(game.gameBoard[2][2]._id).to.equal('abc');
    });
    it('should not move a piece - invalid distance', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[2][2] = { _id: 'abc', color: 'white' };
      const err = game.move(2, 2, 4, 4);
      expect(game).to.be.ok;
      expect(err.message).to.deep.equal('not a valid move - too far');
      expect(game.gameBoard[2][2]._id).to.equal('abc');
    });
    it('should not move a piece - player 1 wrong direction', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[2][2] = { _id: 'abc', color: 'white' };
      const err = game.move(2, 2, 1, 1, player1._id);
      expect(game).to.be.ok;
      expect(err.message).to.deep.equal('not a valid move - wrong direction');
      expect(game.gameBoard[2][2]._id).to.equal('abc');
    });
    it('should not move a piece - player 2 wrong direction', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.currentPlayer = 2;
      game.gameBoard[1][5] = { _id: 'abc', color: 'black' };
      const err = game.move(1, 5, 2, 6, player1._id);
      expect(game).to.be.ok;
      expect(err.message).to.deep.equal('not a valid move - wrong direction');
      expect(game.gameBoard[1][5]._id).to.equal('abc');
    });
    it('should not move a piece - destination occupied', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[2][4] = { _id: 'abc', color: 'white' };
      game.gameBoard[1][5] = { _id: 'def', color: 'black' };
      const err = game.move(2, 4, 1, 5, player1._id);
      expect(game).to.be.ok;
      expect(err.message).to.deep.equal('not a valid move - destination occupied');
      expect(game.gameBoard[2][4]._id).to.equal('abc');
    });
    it('should not move a piece - not your turn', () => {
      const game = new Game({ player1: player1._id, player2: player2._id });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[1][5] = { _id: 'abc', color: 'black' };
      const err = game.move(1, 5, 2, 6, player2._id);
      expect(game).to.be.ok;
      expect(err.message).to.deep.equal('not a valid move - not your turn');
      expect(game.gameBoard[1][5]._id).to.equal('abc');
    });
  });
  describe('#jump', () => {
    it('should jump another piece', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[1][5] = { _id: 'abc', color: 'black' };
      game.gameBoard[2][4] = { _id: 'def', color: 'white' };
      game.jump(2, 4, 0, 6, player1._id.toString());
      expect(game).to.be.ok;
      expect(game.gameBoard[0][6]._id).to.equal('def');
      expect(game.gameBoard[1][5]).to.equal('');
    });
    it('should jump another piece - and king the jumper at the end', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[5][5] = { _id: 'abc', color: 'white' };
      game.gameBoard[6][6] = { _id: 'def', color: 'black' };
      game.jump(5, 5, 7, 7, player1._id.toString());
      expect(game).to.be.ok;
      expect(game.gameBoard[7][7]._id).to.equal('abc');
      expect(game.gameBoard[7][7].status).to.equal('king');
      expect(game.gameBoard[6][6]).to.equal('');
      expect(game.gameBoard[5][5]).to.equal('');
    });
    it('should NOT jump another piece - no piece to jump', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[5][5] = { _id: 'abc', color: 'white' };
      game.jump(5, 5, 7, 7, player1._id.toString());
      expect(game).to.be.ok;
      expect(game.gameBoard[7][7]).to.equal('');
      expect(game.gameBoard[6][6]).to.equal('');
      expect(game.gameBoard[5][5]._id).to.equal('abc');
    });
    it('should NOT jump another piece - cant jump your own piece', () => {
      const game = new Game({ player1, player2 });
      game.gameBoard = game.gameBoard.map(v => v.map(v2 => v2 = ''));
      game.gameBoard[5][5] = { _id: 'abc', color: 'white' };
      game.gameBoard[6][6] = { _id: 'def', color: 'white' };
      game.jump(5, 5, 7, 7, player1._id.toString());
      expect(game).to.be.ok;
      expect(game.gameBoard[7][7]).to.equal('');
      expect(game.gameBoard[5][5]._id).to.equal('abc');
    });
  });
});
