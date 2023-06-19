const http = require("http");
const express = require("express");

const Server = require("./Server/Server");

const app = express();

app.use(express.static("./"));

const server = http.createServer(app);
const chatServer = new Server(server, 26780);
