import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const pieceSchema = new Schema({
  color: { type: String, required: true, enum: ['white', 'black'] },
  status: { type: String, required: true, enum: ['base', 'dead', 'king'], default: 'base' },
});

module.exports = mongoose.model('Piece', pieceSchema);
