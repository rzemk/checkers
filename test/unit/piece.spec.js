/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const sinon = require('sinon');
const Piece = require('../../dst/models/piece');

describe('piece', () => {
  beforeEach(() => {
    sinon.stub(Piece, 'find').yields(null, []);
  });
  afterEach(() => {
    Piece.find.restore();
  });
  describe('constructor', () => {
    it('should create a new piece', (done) => {
      const piece = new Piece({ color: 'black', status: 'base' });
      piece.validate((err) => {
        expect(err).to.be.undefined;
        expect(piece).to.be.ok;
        done();
      });
    });
    it('should not create a new piece - invalid color', (done) => {
      const piece = new Piece({ color: 'blue', status: 'base' });
      piece.validate((err) => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create a new piece - invalid status', (done) => {
      const piece = new Piece({ color: 'black', status: 'emperor' });
      piece.validate((err) => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
