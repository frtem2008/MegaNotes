import { io } from "socket.io-client";

async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    console.log("Connected to server: " + socket.id);
    socket.on("HelloMessage", function (msg) {
      console.log("Received hello message: " + msg);
    });
    socket.on("EchoToClient", function (msg) {
      console.log("Received echo: " + msg);
    });
  });

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  document.getElementById("id1").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      const value = document.getElementById("id1").value;
      console.log("Sending: " + value);
      document.getElementById("id1").value = "";

      socket.emit("EchoToServer", value);
    }
  };
}

function addEventListeners() {
  const body = document.body;
}

window.addEventListener("load", (event) => {
  addEventListeners();
  main();
});
