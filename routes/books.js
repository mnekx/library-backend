const express = require('express');
const Book = require('../models/book');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get('/:bookId', async (req, res) => {
  try {
    const queriedBook = await Book.findById(req.params.bookId);
    res.json(queriedBook);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post('/', async (req, res) => {
  const user = typeof req.body.user != 'undefined' ? req.body.user : undefined;
  if (typeof user.role != 'undefined' && user.role !== 'administrator') {
    res.status(403).send({ message: 'Not authorized!' });
  } else {
    const book = new Book({
      author: req.body.author,
      title: req.body.title,
    });
    try {
      const createdBook = await book.save();
      res.json(createdBook);
    } catch (error) {
      res.json({ message: error });
    }
  }
});

router.delete('/:bookId', async (req, res) => {
  const user = typeof req.body.user != 'undefined' ? req.body.user : undefined;
  if (typeof user.role != 'undefined' && user.role !== 'administrator') {
    res.status(403).send({ message: 'Not authorized!' });
  } else {
    try {
      const deletedBook = await Book.deleteOne({ _id: req.params.bookId });
      res.json(deletedBook);
    } catch (error) {
      res.json({ message: error });
    }
  }
});

router.patch('/:bookId', async (req, res) => {
  const user = typeof req.body.user != 'undefined' ? req.body.user : undefined;
  if (typeof user.role != 'undefined' && user.role !== 'administrator') {
    res.status(403).send({ message: 'Not authorized!' });
  } else {
    try {
      const updatedBook = await Book.updateOne(
        { _id: req.params.bookId },
        { $set: req.body }
      );
      res.json(updatedBook);
    } catch (error) {
      res.json({ message: error });
    }
  }
});

module.exports = router;
