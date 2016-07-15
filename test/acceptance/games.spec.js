/* eslint-disable no-unused-expressions, max-len, no-underscore-dangle */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const Game = require('../../dst/models/game');
const Player = require('../../dst/models/player');

const player1 = new Player({ name: 'Sam' });
const player2 = new Player({ name: 'George' });

describe('games', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate-games.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });
  describe('post /games', () => {
    it('should create a game', (done) => {
      request(app)
      .post('/games')
      .send({ player1: player1._id, player2: player2._id })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.body.game).to.be.ok;
        done();
      });
    });
  });
  describe('put /games/:id/move', () => {
    it('should move a piece', (done) => {
      request(app)
      .put('/games/0123456789012345aaaab111/move')
      .send({ player: '01234567890123456789a111', fromX: 2, fromY: 0, toX: 3, toY: 1 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.body.game.currentPlayer).to.equal(2);
        expect(rsp.body.game.gameBoard[3][1]._id).to.equal('0123456789012345cccccb111');
        expect(rsp.body.game.gameBoard[2][0]).to.equal('');
        done();
      });
    });
    it('should not move a piece', (done) => {
      request(app)
      .put('/games/0123456789012345aaaab111/move')
      .send({ player: '01234567890123456789a111', fromX: 2, fromY: 0, toX: 5, toY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.body.game.currentPlayer).to.equal(1);
        expect(rsp.body.game.gameBoard[2][0]._id).to.equal('0123456789012345cccccb111');
        expect(rsp.body.game.gameBoard[2][3]).to.equal('');
        expect(rsp.body.error).to.be.equal('not a valid move - too far');
        done();
      });
    });
    it('should NOT move a piece - game id too short', (done) => {
      request(app)
      .put('/games/0123456789012345aaaab1/move')
      .send({ player: player1._id, fromX: 0, fromY: 2, toX: 1, toY: 3 })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "0123456789012345aaaab1" fails to match the required pattern');
        done();
      });
    });
    it('should NOT move a piece - game id has invalid characters', (done) => {
      request(app)
      .put('/games/0123456789012345aaaab11r/move')
      .send({ player: player1._id, fromX: 2, fromY: 2, toX: 3, toY: 3 })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "0123456789012345aaaab11r" fails to match the required pattern');
        done();
      });
    });
  });
  describe('put /games/:id/jump', () => {
    it('should jump a piece', (done) => {
      request(app)
      .put('/games/0123456789012345aaaab111/jump')
      .send({ player: '01234567890123456789a111', fromX: 2, fromY: 0, toX: 0, toY: 2 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.body.game.gameBoard[2][0]).to.equal('');
        expect(rsp.body.game.gameBoard[1][1]).to.equal('');
        expect(rsp.body.game.gameBoard[0][2]._id).to.equal('0123456789012345cccccb111');
        done();
      });
    });
    it('should NOT jump a piece - invalid destination', (done) => {
      request(app)
      .put('/games/0123456789012345aaaab111/jump')
      .send({ player: player1._id, fromX: 2, fromY: 0, toX: 0, toY: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.body.game.gameBoard[0][3]).to.equal('');
        expect(rsp.body.game.gameBoard[2][0]._id).to.equal('0123456789012345cccccb111');
        done();
      });
    });
    it('should NOT jump a piece - game id too short', (done) => {
      request(app)
      .put('/games/0123456789012345aaaab1/jump')
      .send({ player: player1._id, fromX: 2, fromY: 0, toX: 0, toY: 4 })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "0123456789012345aaaab1" fails to match the required pattern');
        done();
      });
    });
    it.only('should jump a piece and win the game', (done) => {
      request(app)
      .put('/games/0123456789012345aaaab111/jump')
      .send({ player: '01234567890123456789a111', fromX: 2, fromY: 0, toX: 0, toY: 2 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.body.game.gameBoard[2][0]).to.equal('');
        expect(rsp.body.game.gameBoard[1][1]).to.equal('');
        expect(rsp.body.game.gameBoard[0][2]._id).to.equal('0123456789012345cccccb111');
        expect(rsp.body.game.winner).to.equal(2);
        done();
      });
    });
  });
});
