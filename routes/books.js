'use strict';

var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var books = require(process.env.BOOKS_MODEL ? path.join('..', process.env.BOOKS_MODEL) : '../models/books-fs');

const log = require('debug')('books:router-books');
const error = require('debug')('books:error');

// Add Book.
router.get('/add', (req, res, next) => {
  res.render('bookedit', {
    title: 'Add a Book',
    docreate: true,
    bookkey: '',
    book: undefined,
    breadcrumbs: [
      { href: '/', text: 'Home' },
      { active: true, text: "Add Book" }
    ],
    hideAddNote: true
  });
});

// Save Book.
router.post('/save', (req, res, next) => {
  var p;
  if (req.body.docreate === 'create') {
    p = books.create(req.body.bookkey, req.body.isbn, req.body.title, req.body.author, req.body.genre, req.body.subtitle, req.body.read);
  } else {
    p = books.update(req.body.bookkey, req.body.isbn, req.body.title, req.body.author, req.body.genre, req.body.subtitle, req.body.read);
  }
  p.then(book => {
    res.redirect('/books/view?key=' + req.body.bookkey);
  })
  .catch(err => { next(err); });
});

router.get('/view', (req, res, next) => {
  books.read(req.query.key)
  .then(book => {
    res.render('bookview', {
      title: book ? book.title : '',
      bookkey: req.query.key,
      book: book,
      breadcrumbs: [
        { href: '/', text: 'Home' },
        { active: true, text: book.title }
      ]
    });
  })
  .catch(err => { next(err); });
});

router.get('/edit', (req, res, next) => {
  books.read(req.query.key)
  .then(book => {
    res.render('bookedit', {
      title: book ? ('Edit ' + book.isbn) : "Add a Book",
      docreate: false,
      bookkey: req.query.key,
      book: book,
      breadcrumbs: [
        { href: '/', text: 'Home' },
        { active: true, text: book.title }
      ],
      hideAddNote: true
    });
  })
  .catch(err => { next(err); });
});

router.get('/destroy', (req, res, next) => {
  books.read(req.query.key)
  .then(book => {
    res.render('bookdestroy', {
      title: book ? book.title : '',
      bookkey: req.query.key,
      book: book,
      breadcrumbs: [
        { href: '/', text: 'Home' },
        { active: true, text: "Delete Book" }
      ]
    });
  })
  .catch(err => { next(err); });
});

router.post('/destroy/confirm', (req, res, next) => {
  books.destroy(req.body.bookkey)
  .then(() => { res.redirect('/'); })
  .catch(err => { next(err); });
});

module.exports = router;
