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
      Error("Received echo: " + msg);
    });

    socket.on("AllNotes", function (noteList) {
      // show all notes from note list
      if (noteList === "This author has no notes") {
        console.log(noteList);
        return;
      }
      handlerAll("AllNotesTable");
      console.log("Read notes from: " + noteList[0].author);
      //);
      // console.log(noteList);
      let table = document.getElementById("AllNotesTable");
      table.style.display = "block";
      let tr = table.insertRow(0);
      let td0 = tr.insertCell(0);
      let child0 = document.createElement("th");
      child0.innerHTML = `Author:`;
      td0.appendChild(child0);
      let td01 = tr.insertCell(1);
      let child01 = document.createElement("p");
      child01.innerHTML = `${noteList[0].author}`;
      td01.appendChild(child01);

      tr = table.insertRow(1);

      let td1 = tr.insertCell(0);
      let child1 = document.createElement("th");
      child1.innerHTML = `Title:`;
      td1.appendChild(child1);

      let td2 = tr.insertCell(1);
      let child2 = document.createElement("th");
      child2.innerHTML = `Text:`;
      td2.appendChild(child2);

      let i = 2;

      for (let note of noteList) {
        const tri = table.insertRow(i);

        // var td0 = tri.insertCell(0);
        // let child0 = document.createElement("p");
        // child0.innerHTML = `${note.author}`;
        // td0.appendChild(child0);

        td1 = tri.insertCell(0);
        let child1 = document.createElement("p");
        child1.innerHTML = `${note.title}`;
        td1.appendChild(child1);

        td2 = tri.insertCell(1);
        let child2 = document.createElement("p");
        child2.innerHTML = `${note.text}`;
        td2.appendChild(child2);
        i++;
      }
      // TODO:
      ////New
      // const NewTable = document.createElement("table");
      // tr = NewTable.insertRow(0);
      // td0 = tr.insertCell(0);
      // child0 = document.createElement("p");
      // child0.innerHTML = `Author:`;
      // td0.appendChild(child0);
      // td01 = tr.insertCell(1);
      // child01 = document.createElement("p");
      // child01.innerHTML = `${noteList[0].author}`;
      // td01.appendChild(child01);
    });

    socket.on("AllAuthors", (authors) => {
      handlerAll("AllAuthorsTable");
      console.log("Start writing all authors! ");
      for (let a of authors) {
        console.log(a);
      }
      let table = document.getElementById("AllAuthorsTable");
      table.style.display = "block";
      let tr = table.insertRow(0);
      let td0 = tr.insertCell(0);
      let child0 = document.createElement("th");
      child0.innerHTML = `Authors:`;
      td0.appendChild(child0);

      let i = 1;
      for (let note of authors) {
        const tri = table.insertRow(i++);
        var td1 = tri.insertCell(0);
        let child1 = document.createElement("p");
        child1.innerHTML = `${note}`;
        td1.appendChild(child1);
      }
    });

    socket.on("Search", (result) => {
      handlerAll("SearchTable");
      console.log("Search started!");

      let table = document.getElementById("SearchTable");
      table.style.display = "block";

      if (result.length === 0) {
        Error("We can find nothing...(", "Info");
        // let tr = table.insertRow(0);
        // let td0 = tr.insertCell(0);
        // let child0 = document.createElement("textarea");
        // child0.innerHTML = `We can find nothing...`;
        // td0.appendChild(child0);          
        console.log("We can find nothing...");
        return;
      } 
      for (let note of result) {
        const tri = table.insertRow(0);
        var td1 = tri.insertCell(0);
        let child1 = document.createElement("p");
        child1.innerHTML = `${note.title}`;
        td1.appendChild(child1);

        var td2 = tri.insertCell(1);
        let child2 = document.createElement("p");
        child2.innerHTML = `${note.text}`;
        td2.appendChild(child2);
      }
      // setTimeout(() => {
      //   // handlerAll("SearchTable");
      // }, 5000);
    });


    setTimeout(() => {
      if (document.getElementById("ShowNoteAuthorInput").value === "")
        document.getElementById("ShowNoteAuthorInput").value = "Test";
    }, 3000);
  });

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  const echoInput = document.getElementById("EchoInput");
  echoInput.onkeyup = (ev) => {
    if (ev.code === "Enter") {
      const value = echoInput.value;
      console.log("Echo said:  " + value + "!!!");
      document.getElementById("EchoInput").value = "";
    }
  };

  document.getElementById("NoteAuthorInput").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      document.getElementById("NoteTitleInput").focus();
    }
  };

  document.getElementById("NoteTitleInput").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      document.getElementById("NoteTextInput").focus();
    }
  };

  document.getElementById("TestInputTitle").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      document.getElementById("TestInputMessage1").focus();
    }
  };

  document.getElementById("TestInputMessage1").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      document.getElementById("TestInputMessage2").focus();
    }
  };

  document.getElementById("TestInputMessage2").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      document.getElementById("TestInputMessage3").focus();
    }
  };

  document.getElementById("TestInputMessage3").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      document.getElementById("SendTestInputButton").focus();
    }
  };
  document.getElementById("NoteTextInput").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      // const value = document.getElementById("NoteTextInput").value;
      // console.log("Sending: " + value);
      Send();
    }
  };

  document.getElementById("ShowNoteAuthorInput").onkeyup = (ev) => {
    if (ev.code === "Enter") {
      ShowNotes("ShowNoteAuthorInput");
    }
  };
}

function Add() {
  let addANoteTable = document.getElementById("NewNoteInputTable");
  if (addANoteTable.style.display === "none") {
    addANoteTable.style.display = "block";
  } else {
    addANoteTable.style.display = "none";
  }
}

function Error(text, Class) {
  // TODO: table
  var Info = document.createElement("table");
  Info.id = "infotable01";
  Info.className = "InfoTable";
  // document.getElementById("TestTable").style.display = "none";
  Info.style.display = "block";
  var tr = Info.insertRow(0);
  var td = tr.insertCell(0);
  // td.innerHTML = text;
  // td.class = 
  // const NewTable = document.createElement("table");
  // tr = NewTable.insertRow(0);
  // td0 = tr.insertCell(0);
  // child0 = document.createElement("p");
  // child0.innerHTML = `Author:`;
  // td0.appendChild(child0);
  // td01 = tr.insertCell(1);
  // child01 = document.createElement("p");
  // child01.innerHTML = `${noteList[0].author}`;
  // td01.appendChild(child01);
  const NewText = document.createElement("p");
  NewText.id = "element01";
  NewText.className = Class;
  NewText.innerHTML = text;
  // document.body.append(NewText);

  td.appendChild(NewText);
  document.body.append(Info);
  setTimeout(() => {
    document.getElementById("element01").remove();
    document.getElementById("infotable01").remove();
    }, 1000);
}

function Send() {
  const noteAuthor = document.getElementById("NoteAuthorInput");
  const noteTitle = document.getElementById("NoteTitleInput");
  const noteText = document.getElementById("NoteTextInput");
  if (noteAuthor.value === "") {
    Error("Empty author!", "Error");
    noteAuthor.focus();
  } else if (noteTitle.value === "") {
    Error("Empty title!", "Error");
    noteTitle.focus();
  } else if (noteText.value === "") {
    Error("Empty text!", "Error");
    noteText.focus();
  } else {
    const NewNote = {
      author: noteAuthor.value,
      title: noteTitle.value,
      text: noteText.value,
    };
    ShowNotes("NoteAuthorInput");
    noteAuthor.value = "";
    noteTitle.value = "";
    noteText.value = "";
    console.log("ADD");
    socket.emit("AddNewNote", NewNote);
    noteAuthor.focus();
    setTimeout(() => {
      handlerAll("AllNotesTable");
    }, 3000);
  }
}

function ShowNotes(ID) {
  document.getElementById("AllNotesTable").style.display = "block";
  const author = document.getElementById(ID).value;
  socket.emit("GetAllNotes", author);
}

function ShowAuthors() {
  document.getElementById("AllAuthorsTable").style.display = "block";
  // const author = document.getElementById(ID).value;
  socket.emit("GetAllAuthors");
}

const handlerAll = (ID) => {
  const table = document.getElementById(ID);
  table.innerHTML = "";
  table.style.display = "none";
};

function addEventListeners() {
  const body = document.body;

  const NewNoteButton = document.getElementById("NewNoteButton");
  NewNoteButton.addEventListener("click", (event) => {
    Add();
    document.getElementById("NoteAuthorInput").focus();
  });

  const sendNoteDataButton = document.getElementById("SendNoteData");
  sendNoteDataButton.addEventListener("click", (event) => {
    Send();
  });

  const ShowAllNotes = document.getElementById("ShowAllNotesButton");
  ShowAllNotes.addEventListener("click", (event) => {
    ShowNotes("ShowNoteAuthorInput");
    // handlerAll("AllNotesTable");
  });

  const HideAllNotes = document.getElementById("HideAllNotesButton");
  HideAllNotes.addEventListener("click", (event) => {
    handlerAll("AllNotesTable");
  });
 
  const ShowAllAuthors = document.getElementById("ShowAllAuthorsButton");
  ShowAllAuthors.addEventListener("click", (event) => {
    ShowAuthors();
    // handlerAll("AllNotesTable");
  });

  const HideAllAuthors = document.getElementById("HideAllAuthorsButton");
  HideAllAuthors.addEventListener("click", (event) => {
    document.getElementById("AllAuthorsTable").style.display = "none";
    // handlerAll();
  });

  document
    .getElementById("SendTestInputButton")
    .addEventListener("click", (event) => {
      console.log("Emitted!");
      socket.emit(
        document.getElementById("TestInputTitle").value,
        document.getElementById("TestInputMessage1").value,
        document.getElementById("TestInputMessage2").value,
        document.getElementById("TestInputMessage3").value,
      );
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
  //   document.getElementById("ShowAllNotesTable").append(div);
  // });
}

window.addEventListener("load", (event) => {
  addEventListeners();
  main();
});
