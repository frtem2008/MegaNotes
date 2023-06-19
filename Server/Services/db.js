const { MongoClient, ObjectId } = require("mongodb");

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
  console.info(`Found collection for node data, read ${size} notes`);
  if (size == 0) {
    createdCollection.insertOne({ "": "" });
    console.info("Created empty object to enforce storage creation");
  }
}

async function addNewNote(noteService, note) {
  const client = noteService.dbClient;
  const noteCollection = await noteService.db.collection(
    note.author + " notes"
  );
  console.debug(`Created new collection for ${note.author} notes`);
  noteCollection.insertOne(note);
  console.debug(`Added new note to ${note.author} notes`);
}

async function getAllElementsInCollection(noteService, collectionName) {
  const client = noteService.dbClient;
  const noteCollection = await noteService.db.collection(collectionName);
  console.log(await noteCollection.countDocuments());
  const notes = noteCollection.find({});
  const res = [];
  while (await notes.hasNext()) {
    res.push(await notes.next());
  }
  return res;
}

async function connectToDb(noteService, dbUri) {
  noteService.dbClient = new MongoClient(dbUri);
  const client = noteService.dbClient;
  try {
    let result = await client.connect();
    console.log("Connected to database");
    noteService.db = await result.db(noteService.dbName);
    await listDatabases(noteService.dbClient);
    await createNoteCollection(noteService);
    await listDatabases(noteService.dbClient);
  } catch (error) {
    console.error("Error in database operations: " + error);
  }
}

module.exports = {
  connectToDb,
  listDatabases,
  createNoteCollection,
  addNewNote,
  getAllElementsInCollection,
};
