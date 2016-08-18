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

  get JSON() {
    return JSON.stringify({
      key: this.key,
      isbn: this.isbn,
      title: this.title,
      author: this.author,
      genre: this.genre,
      subtitle: this.subtitle,
      read: this.read
    });
  }

  static fromJSON(json) {
    var data = JSON.parse(json);
    var book = new Book(data.key, data.isbn, data.title, data.author, data.genre, data.subtitle, data.read);
    return book;
  }
};
