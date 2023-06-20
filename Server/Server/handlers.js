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
      console.log("Res: " + res);
      client.emit("AllNotes", res);
    });
  }

  static getAllAuthorsHandler(server, client) {
    console.log("Getting all notes' authors");
    server.noteService.getAllAuthors();
    serverEmitter.once("All authors ready", (names) => {
      console.log("Sending all authors!");
      names.forEach((elem) => console.log(elem));
      client.emit("AllAuthors", names);
    });
  }

  static getAllNotesFromAuthorWithTextHandler(
    server,
    client,
    author,
    field,
    text
  ) {
    console.log("Getting all notes from " + author + " with text: " + text);
    server.noteService.getAllNotesFromAuthorWithText(author, field, text);
    serverEmitter.once(
      "Notes of: " + author + " with text: " + text + " ready",
      (res) => {
        console.log("res here!");
        res.forEach((elem) => console.log(elem));
        client.emit("AllNotesFrom" + author + "WithText" + text, res);
      }
    );
  }

  static disconnectHandler(server, client) {
    console.log("User: " + client.id + " disconnected");
  }
}

module.exports = ServerHandlers;
