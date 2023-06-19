const UUID = require("uuid");
const { Server } = require("socket.io");
const PropertiesReader = require("properties-reader");

const fs = require("fs");
const util = require("util");

const Handlers = require("./Handlers");

const Note = require("../Objects/Note");
const NoteService = require("../Services/Note-service");

const log4js = require("log4js");
const log = log4js.getLogger();

function setupLogger(logFolderPath, logFileName, logLevel) {
  const logFilePath = logFolderPath + logFileName;

  log4js.configure({
    appenders: {
      file: {
        type: "file",
        filename: logFilePath,
        layout: {
          type: "pattern",
          pattern: "[%d{yyyy/MM/dd-hh.mm.ss}] %p - %m",
        },
      },
      console: {
        type: "stdout",
        layout: {
          type: "pattern",
          pattern: "%[[%d{yyyy/MM/dd-hh.mm.ss}] %p%] - %m",
        },
      },
    },
    categories: {
      default: {
        appenders: ["console", "file"],
        level: logLevel,
      },
    },
  });

  const logger = log4js.getLogger("console");
  console.debug = logger.debug.bind(logger);
  console.log = console.info = logger.info.bind(logger);
  console.warn = logger.warn.bind(logger);
  console.error = logger.error.bind(logger);

  fs.writeFile(logFilePath, "", () => {
    console.debug("Logs cleared");
  });
}

class NotesServer {
  constructor(server, port) {
    this.server = new Server(server);
    this.attachCallbacks();

    let properties = PropertiesReader("../Server/Properties/server.properties");

    setupLogger(
      properties.get("log.folder.path"),
      properties.get("log.filename"),
      properties.get("log.level")
    );

    this.noteService = new NoteService(
      properties.get("database.url"),
      properties.get("database.name"),
      properties.get("database.notes.collection.name")
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

      socket.on("AddNewNote", (note) => {
        Handlers.addNotehandler(this, socket, note);
      });

      socket.on("GetAllNotes", (author) => {
        Handlers.getAllNotesHandler(this, socket, author);
      });
    });
  }
}

module.exports = NotesServer;
