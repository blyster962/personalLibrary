var express = require('express');
var router = express.Router();
var books = require('../models/books-memory');

/* GET home page. */
router.get('/', function(req, res, next) {
  books.keylist().then(keylist => {
    var keyPromises = [];
    for (var key of keylist) {
      keyPromises.push(
        books.read(key).then(book => {
          return { key: book.key, title: book.title };
        })
      );
    }
    return Promise.all(keyPromises);
  })
  .then(booklist => {
    res.render('index', { title: 'Books', booklist: booklist });
  })
  .catch(err => { next(err); });
});

module.exports = router;
