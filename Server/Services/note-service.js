const { MongoClient, ObjectId } = require("mongodb");
const Note = require("../Objects/Note");

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.debug("Databases:");
  databasesList.databases.forEach((db) => {
    console.debug(` * ${db.name}`);
  });
}

async function createNoteCollection(noteService) {
  const client = noteService.dbClient;
  console.debug(
    `Creating note data collection: ${noteService.dbCollectionName}...`
  );
  const createdCollection = await noteService.db.collection(
    noteService.dbCollectionName
  );
  noteService.noteCollection = createdCollection;
  const size = await createdCollection.countDocuments();
  console.debug(`Found collection for node data, read ${size} notes`);
  if (size == 0) {
    createdCollection.insertOne({ "": "" });
    console.debug("Created empty object to enforce storage creation");
  }
}

async function connectToDb(noteService, dbUri) {
  noteService.dbClient = new MongoClient(dbUri);
  const client = noteService.dbClient;
  try {
    let result = await client.connect();
    noteService.db = result.db(noteService.dbName);
    await listDatabases(noteService.dbClient);
    await createNoteCollection(noteService);
    await listDatabases(noteService.dbClient);
  } catch (error) {
    console.error("Error in database operations: " + error);
  } finally {
    await noteService.dbClient.close();
  }
}

class NoteService {
  constructor(dbUri, dbName, dbCollectionName) {
    this.dbUri = dbUri;
    this.dbName = dbName;
    this.dbCollectionName = dbCollectionName;
    connectToDb(this, this.dbUri);

    console.debug("Note service created: " + this);
  }

  toString() {
    return `NoteService{"dbUrl" : ${this.dbUri}}`;
  }
}

module.exports = NoteService;
