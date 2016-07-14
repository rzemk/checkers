/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const Player = require('../../dst/models/player');

describe('players', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate-players.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });
  describe('post /players', () => {
    it('should create a player', (done) => {
      request(app)
      .post('/players')
      .send({ name: 'Sammy' })
      .end((err) => {
        expect(err).to.be.null;
        done();
      });
    });
    it('should not create a player - name not passed in', (done) => {
      request(app)
      .post('/players')
      .send({ name: '' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"name" is not allowed to be empty');
        done();
      });
    });
    it('should not create a player - name too short', (done) => {
      request(app)
      .post('/players')
      .send({ name: 'Ti' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"name" length must be at least 3 characters long');
        done();
      });
    });
    it('should retrieve all players', (done) => {
      request(app)
      .get('/players/')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.players).to.be.length(3);
        done();
      });
    });
  });
});
