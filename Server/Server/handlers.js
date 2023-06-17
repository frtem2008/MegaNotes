class ServerHandlers {
  static connectionHandler(server, client) {
    console.log(`Client connected with id: ${client.id}`);
    client.emit("HelloMessage", "Hello from AN2 & AP4 server)");
  }

  static echoHandler(server, client, echoMsg) {
    console.log("Read echo message: " + echoMsg);
    client.emit("EchoToClient", echoMsg + "!!!");
  }

  static disconnectHandler(server, client) {
    console.log("User: " + client.id + " disconnected");
  }
}

module.exports = ServerHandlers;
