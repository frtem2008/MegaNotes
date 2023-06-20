class ServerHandlers {
  static connectionHandler(server, client) {
    console.log(`Client connected with id: ${client.id}`);
    client.emit("HelloMessage", "Hello from AN2 & AP4 server)");
  }

  static echoHandler(server, client, echoMsg) {
    console.log("Read echo message: " + echoMsg);
    client.emit("EchoToClient", echoMsg + "!!!");
  }

  static addNoteHandler(server, client, note) {
    console.log("Read add new note message: " + note);
    server.noteService.saveNote(note);
    client.emit("NoteAddResult", "Note saved");
  }

  static getAllNotesHandler(server, client, author) {
    console.log("Read get all notes message for: " + author);
    server.noteService.getAllNotes(author);
    serverEmitter.once("All notes of " + author + " ready!", (res) => {
      console.log("Sending all notes!");
      client.emit("AllNotes", res);
    });
  }

  static disconnectHandler(server, client) {
    console.log("User: " + client.id + " disconnected");
  }
}

module.exports = ServerHandlers;
