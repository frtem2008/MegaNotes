import {io} from "socket.io-client";

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
            console.log("Read notes from: " + noteList[0].author);
            //);
            // console.log(noteList);
            let table = document.getElementById("TestTable");
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
            const NewTable = document.createElement("table");
            tr = NewTable.insertRow(0);
            td0 = tr.insertCell(0);
            child0 = document.createElement("p");
            child0.innerHTML = `Author:`;
            td0.appendChild(child0);
            td01 = tr.insertCell(1);
            child01 = document.createElement("p");
            child01.innerHTML = `${noteList[0].author}`;
            td01.appendChild(child01);
        });
    });

    socket.on("disconnect", () => {
        console.log(socket.id); // undefined
    });

    const echoInput = document.getElementById("EchoInput");
    echoInput.onkeyup = (ev) => {
        if (ev.code === "Enter") {
            const value = echoInput.value;
            console.log("Sending: " + value);
            document.getElementById("id1").value = "";
        }
    };

    document.getElementById("NoteAuthorInput").onkeyup = (ev) => {
        if (ev.code === "Enter") {
            document.getElementById("Title").focus();
        }
    };

    document.getElementById("NoteTitleInput").onkeyup = (ev) => {
        if (ev.code === "Enter") {
            document.getElementById("Text").focus();
        }
    };

    document.getElementById("NoteTextInput").onkeyup = (ev) => {
        if (ev.code === "Enter") {
            const value = document.getElementById("NoteTextInput").value;
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

function Error(text) {
    // TODO:
    // var NewText = document.createElement("table");
    const NewText = document.createElement("p");
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
    const noteAuthor = document.getElementById("NoteAuthorInput");
    const noteTitle = document.getElementById("NoteTitleInput");
    const noteText = document.getElementById("NoteTextInput");
    if (noteAuthor.value === "") {
        Error("Empty author!");
        noteAuthor.focus();
    } else if (noteTitle.value === "") {
        Error("Empty title!");
        noteTitle.focus();
    } else if (noteText.value === "") {
        Error("Empty text!");
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
    }
}

function ShowNotes(ID) {
    const author = document.getElementById(ID).value;
    socket.emit("GetAllNotes", author);
}

const handlerAll = () => {
    const table = document.getElementById("TestTable");
    table.innerHTML = "";
};

function addEventListeners() {
    const body = document.body;

    const NewNoteButton = document.getElementById("NewNoteButton");
    NewNoteButton.addEventListener("click", (event) => {
        Add();
    });

    // const NewNoteNot = document.getElementById("NewNoteNot");
    // NewNoteNot.addEventListener("click", (event) => {
    //   AddNot();
    // });

    const sendNoteDataButton = document.getElementById("SendNoteData");
    sendNoteDataButton.addEventListener("click", (event) => {
        Send();
    });

    const ShowAll = document.getElementById("ShowAllNotesButton");
    ShowAll.addEventListener("click", (event) => {
        ShowNotes("ShowNoteAuthorInput");
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
    //   document.getElementById("TestTable").append(div);
    // });
}

window.addEventListener("load", (event) => {
    addEventListeners();
    main();
});
