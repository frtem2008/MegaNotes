const Note = require("../Objects/Note");
const EventEmitter = require("./EventEmitter");
const {
  connectToDb,
  addNewNote,
  getAllElementsInCollection,
  getAllCollectionNames,
  getAllNotesWithField,
} = require("./DataBase");

class NoteService {
  constructor(dbUri, dbName, dbCollectionName) {
    this.dbUri = dbUri;
    this.dbName = dbName;
    this.dbCollectionName = dbCollectionName;

    global.serverEmitter = new EventEmitter();

    connectToDb(this, this.dbUri).then(() => {
      console.debug("Note service created: " + this);
    });
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
        const msgTitle = "All notes of " + author + " ready!";
        if (result.length === 0) {
          result = "This author has no notes";
        }
        serverEmitter.emit(msgTitle, result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getAllAuthors() {
    console.log("Getting all note authors");
    getAllCollectionNames(this).then((names) => {
      console.log("Names: " + names);
      const formattedNames = names.map((name) => name.name.slice(0, -6));
      let index = formattedNames.indexOf("No");
      if (index !== -1) {
        formattedNames.splice(index, 1);
      }

      serverEmitter.emit("All authors ready", formattedNames);
    });
  }

  getAllNotesFromAuthorWithText(author, field, text) {
    getAllNotesWithField(this, author, field, text).then((res) => {
      console.log(
        `Found ${res.length} notes from ${author} with field ${field} with data ${text}`
      );
      // console.log(`I am here can you here me??? ${res.length}`);

      const notes = res.map((dbNote) => ({
        author: dbNote.author,
        title: dbNote.title,
        text: dbNote.text,
      }));
      serverEmitter.emit(
        "Notes of: " + author + " with text: " + text + " ready",
        notes
      );
    });
  }

  toString() {
    return `NoteService{"dbUrl" : ${this.dbUri}}`;
  }
}

module.exports = NoteService;
