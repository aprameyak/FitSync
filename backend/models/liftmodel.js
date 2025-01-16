const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const liftSchema = new Schema(
  {
    userId: {
        type: String,
        required: true,
    },
    exercise: {
        type: String,
        required: true,
    },
    repetitions: {
        type: Number,
        required: true,
    },
    load: {
        type: Number,
        required: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lift', liftSchema);
