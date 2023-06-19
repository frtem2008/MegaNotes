import { io } from "socket.io-client";

let socket;

async function main() {
  socket = io();

  // client-side
  socket.on("connect", () => {
    console.log("Connected to server: " + socket.id);

    socket.on("HelloMessage", function (msg) {
      console.log("Received hello message: " + msg);
    });

    socket.on("EchoToClient", function (msg) {
      console.log("Received echo: " + msg);
    });

    socket.on("AllNotes", function (noteList) {
      // show all notes from note list
      console.log("Read notes from: " + noteList[0].author); //);
      console.log(noteList);

      let header = document.createElement("header");
      header.className = "tr";
      header.innerHTML += `
      <tr>
        <td width="80px">
          ${noteList[0].author} notes
        </td>
        <td width="30px">Title</td>
        <td width="100px">Text</td>
      </tr> `;
      // document.getElementById("Testtable").append('<td>' + 5 + '</td>');
      document.getElementById("Testtable").append(header);
      // document.getElementById("Testtable").append(header);
      
      // for (let note of noteList) {
      //   let div = document.createElement("div");
      //   div.className = "tr";
      //   div.innerHTML = `
      //       <td>
      //       ${note.author}
      //       </td>
      //       <td>
      //       ${note.author}
      //       </td>
      //     `;    
      //   document.getElementById("Testtable").append(div);
    
      // }
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
    }
  };
}

function Add() {
  let x = document.getElementById("TableAdd");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function AddNot() {
  document.getElementById("TableAdd").style.display = "none";
}
function addEventListeners() {
  const body = document.body;

  const NewNote = document.getElementById("NewNote");
  NewNote.addEventListener("click", (event) => {
    Add();
  });

  // const NewNoteNot = document.getElementById("NewNoteNot");
  // NewNoteNot.addEventListener("click", (event) => {
  //   AddNot();
  // });

  const Send = document.getElementById("Add");
  Send.addEventListener("click", (event) => {
    const note = {
      author: document.getElementById("Author").value,
      title: document.getElementById("Title").value,
      text: document.getElementById("Text").value,
    };
    document.getElementById("Author").value = "";
    document.getElementById("Title").value = "";
    document.getElementById("Text").value = "";
    // document.getElementById("TableAdd").style.display = "none";
    console.log("ADDDDDDD");
    socket.emit("AddNewNote", note);
  });

  const GetAll = document.getElementById("GetAll");
  const Author = document.getElementById("NoteAuthor");
  GetAll.addEventListener("click", (event) => {
    socket.emit("GetAllNotes", Author.value);
  });

  // Test sample
  const Test = document.getElementById("TestButton");
  Test.addEventListener("click", (event) => {
    console.log("Test: Read notes from: ");

    let div = document.createElement("div");
    div.className = "table";
    div.innerHTML =
      "<strong>Это таблица, в которую добавляются данные)</strong>";

    let t = "Alice";
    console.log(t);
    div.innerHTML = `
      <tr>
        <td>
          ${t} + 1
        </td>
        <td>
          ${t} + 2
        </td>
        <td>
          ${t} + 3
        </td>
      </tr> `;

    // div.innerHTML = '<tr><td> ${100} <td /><td>Title: <td /><td>: <td /><tr />'
    document.getElementById("Testtable").append(div);
  });
}

window.addEventListener("load", (event) => {
  addEventListeners();
  main();
});
