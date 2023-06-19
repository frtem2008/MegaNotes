const UUID = require("uuid");

class Note {
  constructor(author, title, text) {
    this.author = author;
    this.title = title;
    this.text = text;
    this.id = UUID.v4();
    this._id = this.id;
    console.debug("New note created: " + this);
  }

  toString() {
    return `Note{"author" : ${this.author}, "title" : ${this.title}, "text" : ${this.text}, "id" : ${this.id}}`;
  }
}

module.exports = Note;
