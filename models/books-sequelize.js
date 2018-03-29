'use strict';

const util = require('util');
const fs = require('fs-extra');
const jsyaml = require('js-yaml');
const Sequelize = require('sequelize');
const log = require('debug')('books:sequelize-model');
const error = require('debug')('books:error');
const Book = require('./book');

exports.connectDB = function() {
  var SQBook;
  var sequlz;

  if (SQBook) return SQBook.sync();

  return new Promise((resolve, reject) => {
    fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  })
  .then(yamltext => {
    return jsyaml.safeLoad(yamltext, 'utf8');
  })
  .then(params => {
    sequlz = new Sequelize(params.dbname, params.username, params.password, params.params);
    SQBook = sequlz.define('Book', {
      bookkey: { type: Sequelize.INTEGER, primaryKey: true, unique: true },
      isbn: Sequelize.STRING,
      title: Sequelize.STRING,
      author: Sequelize.STRING,
      genre: Sequelize.STRING,
      subtitle: Sequelize.STRING,
      read: Sequelize.STRING
    });
    return SQBook.sync();
  });
};

exports.create = function(key, isbn, title, author, genre, subtitle, read) {
  return exports.connectDB()
  .then(SQBook => {
    return SQBook.create({
      bookkey: key,
      isbn: isbn,
      title: title,
      author: author,
      genre: genre,
      subtitle: subtitle,
      read: read
    });
  });
};

exports.update = function(key, isbn, title, author, genre, subtitle, read) {
  return exports.connectDB()
  .then(SQBook => {
    return SQBook.find({ where: { bookkey: key } })
    .then(book => {
      if (!book) {
        throw new Error("No book found for key " + key);
      } else {
        return book.updateAttributes({
          isbn: isbn,
          title: title,
          author: author,
          genre: genre,
          subtitle: subtitle,
          read: read
        });
      }
    });
  });
};

exports.read = function(key) {
  return exports.connectDB().then(SQBook => {
    return SQBook.find({ where: { bookkey: key } })
    .then(book => {
      if (!book) {
        throw new Error("No book found for key " + key);
      } else {
        return new Book(book.bookkey, book.isbn, book.title, book.author, book.genre, book.subtitle, book.read);
      }
    });
  });
};

exports.destroy = function(key) {
  return exports.connectDB()
  .then(SQBook => {
    return SQBook.find({ where: { bookkey: key } })
    .then(book => { return book.destroy(); });
  });
};

exports.keylist = function() {
  return exports.connectDB()
  .then(SQBook => {
    return SQBook.findAll({ attributes: [ 'bookkey' ] })
    .then(books => {
      return books.map(book => book.bookkey);
    });
  });
};

exports.count = function() {
  return exports.connectDB().then(SQBook => {
    return SQBook.count().then(count => {
      //log('COUNT ' + count);
      return count;
    });
  });
};
