const Note = require("../Objects/Note");
const EventEmitter = require("./EventEmitter");
const { connectToDb, addNewNote, getAllElementsInCollection } = require("./Db");

class NoteService {
  constructor(dbUri, dbName, dbCollectionName) {
    this.dbUri = dbUri;
    this.dbName = dbName;
    this.dbCollectionName = dbCollectionName;

    global.serverEmitter = new EventEmitter();

    connectToDb(this, this.dbUri);

    console.debug("Note service created: " + this);
  }

  saveNote(note) {
    const toSave = new Note(note.author, note.title, note.text);
    console.debug("Saving new note: " + toSave);
    addNewNote(this, toSave);
  }

  getAllNotes(author) {
    console.log(`All notes of ${author}: `);
    const allNotes = getAllElementsInCollection(this, author + " notes");
    allNotes
      .then((result) => {
        serverEmitter.emit("All notes of " + author + " ready!", result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  toString() {
    return `NoteService{"dbUrl" : ${this.dbUri}}`;
  }
}

module.exports = NoteService;
