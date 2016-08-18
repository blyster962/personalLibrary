'use strict';

const util = require('util');
const sqlite3 = require('sqlite3');

const log = require('debug')('books:sqlite3-model');
const error = require('debug')('books:error');

const Book = require('./book');

sqlite3.verbose();
var db; // store the database connection here
var dbStatements = {
  create: 'INSERT INTO books (bookkey, isbn, title, author, genre, subtitle, read) VALUES (?, ? , ?, ?, ?, ?, ?);',
  read: 'SELECT * FROM books WHERE bookkey = ?',
  update: 'UPDATE books SET title = ?, author = ?, genre = ?, subtitle = ?, read = ? WHERE bookkey = ?',
  destroy: 'DELETE FROM books WHERE bookkey = ?',
  keylist: 'SELECT bookkey FROM books',
  count: 'SELECT COUNT(bookkey) as count FROM books'
};

exports.connectDb = function() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    var dbfile = process.env.SQLITE_FILE || "books.sqlite3";
    db = new sqlite3.Database(dbfile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
      if (err) reject(err);
      else {
        log('Opened SQLite3 database ' + dbfile);
        resolve(db);
      }
    });
  });
};

exports.create = function(key, isbn, title, author, genre, subtitle, read) {
  return exports.connectDb().then(() => {
    var book = new Book(key, isbn, title, author, genre, subtitle, read);
    return new Promise((resolve, reject) => {
      db.run(dbStatements.create, [key, isbn, title, author, genre, subtitle, read], err => {
        if(err) reject(err);
        else {
          log('CREATE ' + util.inspect(book));
          resolve(book);
        }
      });
    });
  });
};

exports.update = function(key, isbn, title, author, genre, subtitle, read) {
  return exports.connectDb().then(() => {
    var book = new Book(key, isbn, title, author, genre, subtitle, read);
    return new Promise((resolve, reject) => {
      db.run(dbStatements.update, [title, author, genre, subtitle, read, key], err => {
        if(err) reject(err);
        else {
          log('UPDATE ' + util.inspect(book));
          resolve(book);
        }
      });
    });
  });
};

exports.read = function(key) {
  return exports.connectDb().then(() => {
    return new Promise((resolve, reject) => {
      db.get(dbStatements.read, [key], (err, row) => {
        if(err) reject(err);
        else {
          var book = new Book(row.bookkey, row.isbn, row.title, row.author, row.genre, row.subtitle, row.read);
          log('READ ' + util.inspect(book));
          resolve(book);
        }
      });
    });
  });
};

exports.destroy = function(key) {
  return exports.connectDb().then(() => {
    return new Promise((resolve, reject) => {
      db.run(dbStatements.destroy, [key], err => {
        if(err) reject(err);
        else {
          log('DESTROY ' + key);
          resolve();
        }
      });
    });
  });
};

exports.keylist = function() {
  return exports.connectDb().then(() => {
    return new Promise((resolve, reject) => {
      var keyz = [];
      db.each(dbStatements.keylist,
      (err, row) => {
        if(err) reject(err);
        else keyz.push(row.bookkey);
      },
      (err, num) => {
        if (err) reject(err);
        else resolve(keyz);
      });
    });
  });
};

exports.count = function() {
  return exports.connectDb().then(() => {
    return new Promise((resolve, reject) => {
      db.get(dbStatements.count, (err, row) => {
        if(err) return reject(err);
        resolve(row.count);
      });
    });
  });
};
