const UUID = require("uuid");
const { Server } = require("socket.io");
const PropertiesReader = require("properties-reader");

const fs = require("fs");

const Handlers = require("./Handlers");

const Note = require("../Objects/Note");
const NoteService = require("../Services/Note-service");

class NotesServer {
  constructor(server, port) {
    this.server = new Server(server);
    this.attachCallbacks();

    let properties = PropertiesReader("../Server/Properties/server.properties");
    this.noteService = new NoteService(
      properties.get("data.dir"),
      properties.get("database.url")
    );

    server.listen(process.env.PORT || port, () => {
      console.log(`Server started on port ${server.address().port} :)`);
    });
  }

  attachCallbacks() {
    this.server.on("connection", (socket) => {
      Handlers.connectionHandler(this, socket);

      socket.on("disconnect", () => {
        Handlers.disconnectHandler(this, socket);
      });

      socket.on("EchoToServer", (echoMsg) => {
        Handlers.echoHandler(this, socket, echoMsg);
      });
    });
  }
}

module.exports = NotesServer;
