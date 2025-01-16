const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
