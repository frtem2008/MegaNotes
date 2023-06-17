const http = require("http");
const express = require("express");
const morgan = require("morgan");

const Server = require("./Server/Server");

const app = express();
app.use(morgan("combined"));
app.use(express.static("./"));

const server = http.createServer(app);
const chatServer = new Server(server, 26780);
