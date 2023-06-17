const { MongoClient, ObjectId } = require("mongodb");

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => {
    console.log(` - ${db.name}`);
  });
}

async function connectToDb(noteService, dbUri) {
  noteService.dbClient = new MongoClient(dbUri);
  try {
    await noteService.dbClient.connect();
    console.log("Db list:\n" + (await listDatabases(noteService.dbClient)));
  } catch (error) {
    console.error("Error connecting to database: " + error);
  } finally {
    await noteService.dbClient.close();
  }
}

class NoteService {
  constructor(dataDir, dbUri) {
    this.rootDir = dataDir;
    this.dbUri = dbUri;
    this.dbClient = undefined;
    connectToDb(this, this.dbUri);

    console.log("Note service created: " + this);
  }

  toString() {
    return `NoteService{"dataDir" : ${this.rootDir}, \n"dbUrl" : ${this.dbUri}}`;
  }
}

module.exports = NoteService;
