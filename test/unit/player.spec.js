/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const sinon = require('sinon');
const Player = require('../../dst/models/player');

describe('player', () => {
  beforeEach(() => {
    sinon.stub(Player, 'find').yields(null, []);
  });
  afterEach(() => {
    Player.find.restore();
  });
  describe('constructor', () => {
    it('should create a new player', (done) => {
      const player = new Player({ name: 'bill' });
      player.validate(err => {
        expect(err).to.be.undefined;
        expect(player).to.be.ok;
        done();
      });
    });
    it('should NOT create a new player - name too short', (done) => {
      const player = new Player({ name: 'bi' });
      player.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
