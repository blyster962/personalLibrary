'use strict';

const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const log = require('debug')('books:fs-model');
const error = require('debug')('books:error');

const Book = require('./book');

function bookDir() {
  const dir = process.env.BOOK_FS_DIR || "book-fs-data";
  return new Promise((resolve, reject) => {
    fs.ensureDir(dir, err => {
      if (err) reject(err);
      else resolve(dir);
    });
  });
}

function filePath(bookdir, key) {
  return path.join(bookdir, key + '.json');
}

function readJSON(bookdir, key) {
  const readFrom = filePath(bookdir, key);
  return new Promise((resolve, reject) => {
    fs.readFile(readFrom, 'utf8', (err, data) => {
      if (err) return reject(err);
      log('readJSON ' + data);
      resolve(Book.fromJSON(data));
    });
  });
}

exports.update = exports.create = function(key, isbn, title, author, genre, subtitle, read) {
  return bookDir().then(bookdir => {
    if (key.indexOf('/') >= 0)
      throw new Error(`key ${key} cannot contain '/'`);

    var book = new Book(key, isbn, title, author, genre, subtitle, read);
    const writeTo = filePath(bookdir, key);
    const writeJSON = book.JSON;
    log('WRITE ' + writeTo + ' ' + writeJSON);

    return new Promise((resolve, reject) => {
      fs.writeFile(writeTo, writeJSON, 'utf8', err => {
        if (err) reject(err);
        else resolve(book);
      });
    });
  });
};

exports.read = function(key) {
  return bookDir().then(bookdir => {
    return readJSON(bookdir, key).then(thebook => {
      log('READ ' + bookdir + '/' + key + ' ' + util.inspect(thebook));
      return thebook;
    });
  });
};

exports.destroy = function(key) {
  return bookDir().then(bookdir => {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath(bookdir, key), err => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

exports.keylist = function() {
  return bookDir().then(bookdir => {
    return new Promise((resolve, reject) => {
      fs.readdir(bookdir, (err, filez) => {
        if (err) return reject(err);
        if (!filez) filez = [];
        resolve({ bookdir, filez });
      });
    });
  })
  .then(data => {
    log('keylist dir=' + data.bookdir + ' files=' + util.inspect(data.filez));
    var thebooks = data.filez.map(fname => {
      var key = path.basename(fname, '.json');
      log('About to READ ' + key);
      return readJSON(data.bookdir, key).then(thebook => {
        return thebook.key;
      });
    });
    return Promise.all(thebooks);
  });
};

exports.count = function() {
  return bookDir().then(bookdir => {
    return new Promise((resolve, reject) => {
      fs.readdir(bookdir, (err, filez) => {
        if (err) return reject(err);
        resolve(filez.length);
      });
    });
  });
};
