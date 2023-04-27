const mongoose = require('mongoose');

const BattleHistorySchema = new mongoose.Schema({
  result: { type: String, required: false },
  opponent: { type: String, required: false },
  remainingHp: { type: Number, required: false },
});

const PokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  types: [{ type: String }], // Updated types field
  sprites: {
    front_default: { type: String },
  },
  stats: [
    {
      base_stat: { type: Number },
      stat: {
        name: { type: String },
      },
    },
  ],
  battleHistory: [BattleHistorySchema],
});

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

module.exports = Pokemon;