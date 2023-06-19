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
      // TODO:
      // show all notes from note list
      console.log("Read notes from: " + noteList[0].author); //);
      // console.log(noteList);
      var table = document.getElementById("Testtable");
      var tr = table.insertRow(0);

      var td0 = tr.insertCell(0);
      let child0 = document.createElement("th");
      child0.innerHTML = `Author:`;
      td0.appendChild(child0);
      var td01 = tr.insertCell(1);
      let child01 = document.createElement("p");
      child01.innerHTML = `${noteList[0].author}`;
      td01.appendChild(child01);

      var tr = table.insertRow(1);

      var td1 = tr.insertCell(0);
      let child1 = document.createElement("th");
      child1.innerHTML = `Title:`;
      td1.appendChild(child1);

      var td2 = tr.insertCell(1);
      let child2 = document.createElement("th");
      child2.innerHTML = `Text:`;
      td2.appendChild(child2);

      let i = 2;

      for (let note of noteList) {
        var tri = table.insertRow(i);

        // var td0 = tri.insertCell(0);
        // let child0 = document.createElement("p");
        // child0.innerHTML = `${note.author}`;
        // td0.appendChild(child0);

        var td1 = tri.insertCell(0);
        let child1 = document.createElement("p");
        child1.innerHTML = `${note.title}`;
        td1.appendChild(child1);

        var td2 = tri.insertCell(1);
        let child2 = document.createElement("p");
        child2.innerHTML = `${note.text}`;
        td2.appendChild(child2);
        i++;
      }

      ////New
      // var Newtable = document.createElement("table");
      // tr = Newtable.insertRow(0);
      // td0 = tr.insertCell(0);
      // child0 = document.createElement("th");
      // child0.innerHTML = `Author:`;
      // td0.appendChild(child0);
      // td01 = tr.insertCell(1);
      // child01 = document.createElement("p");
      // child01.innerHTML = `${noteList[0].author}`;
      // td01.appendChild(child01);
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

  document.getElementById("Text").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      const value = document.getElementById("Text").value;
      // console.log("Sending: " + value);
      Send();
    }
  };

  document.getElementById("Author").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      document.getElementById("Title").focus();
    }
  };

  document.getElementById("Title").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      document.getElementById("Text").focus();
    }
  };

  document.getElementById("NoteAuthor").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      ShowNotes("NoteAuthor");
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

function Error(text) {
  // TODO:
  // var NewText = document.createElement("table");
  var NewText = document.createElement("p");
  NewText.id = "element01";
  NewText.className = "Error";
  NewText.innerHTML = text;
  document.body.append(NewText);
  setTimeout(() => {
    // document.getElementById("element01").style.display = "none";
    document.getElementById("element01").remove();
  }, 1000);
}

function Send() {
  if (document.getElementById("Author").value === "") {
    Error("Empty author!");
    document.getElementById("Author").focus();
  } else if (document.getElementById("Title").value === "") {
    Error("Empty title!");
    document.getElementById("Title").focus();
  } else if (document.getElementById("Text").value === "") {
    Error("Empty text!");
    document.getElementById("Text").focus();
  } else {
    const NewNote = {
      author: document.getElementById("Author").value,
      title: document.getElementById("Title").value,
      text: document.getElementById("Text").value,
    };
    document.getElementById("Author").value = "";
    document.getElementById("Title").value = "";
    document.getElementById("Text").value = "";
    console.log("ADD");
    socket.emit("AddNewNote", NewNote);
    document.getElementById("Author").focus();
  }
}

function ShowNotes(ID) {
  const author = document.getElementById(ID).value;
  socket.emit("GetAllNotes", author);
}

const handlerAll = () => {
  const table = document.getElementById("Testtable");
  table.innerHTML = "";
};

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

  const Send1 = document.getElementById("Add");
  Send1.addEventListener("click", (event) => {
    Send();
  });

  const GetAll = document.getElementById("GetAll");
  GetAll.addEventListener("click", (event) => {
    ShowNotes("NoteAuthor");
    handlerAll();
  });

  // Test sample
  // const Test = document.getElementById("TestButton");
  // Test.addEventListener("click", (event) => {
  //   console.log("Test: Read notes from: ");

  //   let div = document.createElement("div");
  //   div.className = "table";
  //   div.innerHTML =
  //     "<strong>Это таблица, в которую добавляются данные)</strong>";

  //   let t = "Alice";
  //   console.log(t);
  //   div.innerHTML = `
  //     <tr>
  //       <td>
  //         ${t} + 1
  //       </td>
  //       <td>
  //         ${t} + 2
  //       </td>
  //       <td>
  //         ${t} + 3
  //       </td>
  //     </tr> `;

  //   // div.innerHTML = '<tr><td> ${100} <td /><td>Title: <td /><td>: <td /><tr />'
  //   document.getElementById("Testtable").append(div);
  // });
}

window.addEventListener("load", (event) => {
  addEventListeners();
  main();
});
