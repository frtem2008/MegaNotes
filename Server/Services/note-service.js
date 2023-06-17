const { MongoClient, ObjectId } = require("mongodb");
const Note = require("../Objects/Note");

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => {
    console.log(` - ${db.name}`);
  });
}

async function createNoteCollection(noteService) {
  const client = noteService.dbClient;
  console.log(
    `Creating note data collection: ${noteService.dbCollectionName}...`
  );
  const createdCollection = await noteService.db.collection(
    noteService.dbCollectionName
  );
  createdCollection.insertOne(
    new Note("None", "Initial note to create a collection")
  );
  console.log(
    `Collection for note data created: ${createdCollection.insertedId}`
  );
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
  constructor(dataDir, dbUri, dbName, dbCollectionName) {
    this.dbUri = dbUri;
    this.dbName = dbName;
    this.dbCollectionName = dbCollectionName;
    connectToDb(this, this.dbUri);

    this.rootDir = dataDir;

    console.log("Note service created: " + this);
  }

  toString() {
    return `NoteService{"dataDir" : ${this.rootDir}, \n"dbUrl" : ${this.dbUri}}`;
  }
}

module.exports = NoteService;
