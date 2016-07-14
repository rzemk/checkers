import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: { type: String, required: true, minlength: 3 },
});

module.exports = mongoose.model('Player', playerSchema);
