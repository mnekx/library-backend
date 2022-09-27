const mongoose = require('mongoose');

const Book = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  }
);

module.exports = mongoose.model('Book', Book);
