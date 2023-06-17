const UUID = require("uuid");

class Note {
  constructor(author, text) {
    this.author = author;
    this.text = text;
    this.id = UUID.v4();
    this._id = this.id;
    console.log("New note created: " + this);
  }

  toString() {
    return `Note{"author" : ${this.author}, "id" : ${this.id}, "text" : ${this.text}}`;
  }
}

module.exports = Note;
