var express = require('express');
var router = express.Router();
var path = require('path');
var books = require(process.env.BOOKS_MODEL ? path.join('..', process.env.BOOKS_MODEL) : '../models/books-memory');

const log = require('debug')('books:router-home');
const error = require('debug')('books:error');

/* GET home page. */
router.get('/', function(req, res, next) {
  books.keylist().then(keylist => {
    var keyPromises = keylist.map(key => {
      return books.read(key).then(book => {
        return { key: book.key, title: book.title, author: book.author };
      });
    });
//    var keyPromises = [];
//    for (var key of keylist) {
//      keyPromises.push(
//        books.read(key).then(book => {
//          return { key: book.key, title: book.title, author: book.author };
//        })
//      );
//    }
    return Promise.all(keyPromises);
  })
  .then(booklist => {
    res.render('index', {
      title: 'Books',
      booklist: booklist,
      user: req.user ? req.user : undefined,
      breadcrumbs: [
        { href: '/', text: 'Home' }
      ]
    });
  })
  .catch(err => { error(err); next(err); });
});

module.exports = router;
