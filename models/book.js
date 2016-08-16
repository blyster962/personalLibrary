'use strict';

module.exports = class Book {
  constructor(key, isbn, title, author, genre, subtitle, read) {
    this.key = key;
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.subtitle = subtitle;
    this.read = read;
  }
};
