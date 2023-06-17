const { MongoClient, ObjectId } = require("mongodb");

async function connectToDb(dbUrl) {}

class NoteService {
  constructor(dataDir, dbUrl) {
    this.rootDir = dataDir;
    this.dbUrl = dbUrl;

    console.log("Note service created: " + this);
  }

  toString() {
    return `NoteService{"dataDir" : ${this.rootDir}, \n"dbUrl" : ${this.dbUrl}}`;
  }
}

module.exports = NoteService;
