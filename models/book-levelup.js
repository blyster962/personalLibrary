'use strict';

const util = require('util');
const levelup = require('level');

const log = require('debug')('books:levelup-model');
const error = require('debug')('books:error');

const Book = require('./book');

var db; // store the database connection here

function connectDb () {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    levelup(process.env.LEVEL_DB_LOCATION || 'books.levelup', {
      createIfMissing: true,
      valueEncoding: 'json'
    },
    (err, _db) => {
      if (err) return reject(err);
      db = _db;
      resolve();
    });
  });
}

exports.update = exports.create = function(key, isbn, title, author, genre, subtitle, read) {
  return connectDb().then(() => {
    var book = new Book(key, isbn, title, author, genre, subtitle, read);
    return new Promise((resolve, reject) => {
      db.put(key, book, err => {
        if (err) reject(err);
        else resolve(book);
      });
    });
  });
};

exports.read = function(key) {
  return connectDb().then(() => {
    return new Promise((resolve, reject) => {
      db.get(key, (err, book) => {
        if (err) reject(err);
        else resolve(new Book(book.key, book.isbn, book.title, book.author, book.genre, book.subtitle, book.read));
      });
    });
  });
};

exports.destroy = function(key) {
  return connectDb().then(() => {
    return new Promise((resolve, reject) => {
      db.del(key, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

exports.keylist = function() {
  return connectDb().then(() => {
    var keyz = [];
    return new Promise((resolve, reject) => {
      db.createReadStream()
        .on('data', data => keyz.push(data.key))
        .on('error', err => reject(err))
        .on('end', () => resolve(keyz));
    });
  });
};

exports.count = function() {
  return connectDb().then(() => {
    var total = 0;
    return new Promise((resolve, reject) => {
      db.createReadStream()
        .on('data', data => total++)
        .on('error', err => reject(err))
        .on('end', () => resolve(total));
    });
  });
};
