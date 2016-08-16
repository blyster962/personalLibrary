'use strict';

var books = [];
const Book = require('./book');

exports.update = exports.create = function(key, isbn, title, author, desc, subtitle, read) {
  return new Promise((resolve, reject) => {
    books[key] = new Book(key, isbn, title, author, desc, subtitle, read);
    resolve(books[key]);
  });
};

exports.read = function(key) {
  return new Promise((resolve, reject) => {
    if (books[key]) resolve(books[key]);
    else reject(`Book ${key} does not exist`);
  });
};

exports.destroy = function(key) {
  return new Promise((resolve, reject) => {
    if (books[key]) {
      delete books[key];
      resolve();
    } else reject(`Book ${key} does not exist`);
  });
};

exports.keylist = function() {
  return new Promise((resolve, reject) => {
    resolve(Object.keys(books));
  });
};

exports.count = function() {
  return new Promise((resolve, reject) => {
    resolve(books.length);
  });
};
