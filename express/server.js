'use strict';
const express = require('express');
const http = require('http');
const WebSocket = require("ws");
const app = express();
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const port = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views/");
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("Connected to Browser ✅");
    sockets.forEach((aSocket) => 
        aSocket.send(`${socket.nickname} join chat`)
    );
    socket.on('close', () => console.log("Disconnected from Client"));
    socket.on('close', () => {
        sockets.pop();
        sockets.forEach((aSocket) => 
            aSocket.send(`${socket.nickname} left chat`)
        );
    });
    socket.on('message', (msg) => {
        const message = JSON.parse(msg.toString());
        const today = new Date();    
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) => 
                    aSocket.send(`[${today.toLocaleString()}] ${socket.nickname}: ${message.payload}`)
                );
                console.log(message);
                break;
            case "nickname":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname} => ${message.payload}`)
                );
                socket["nickname"] = message.payload;
                console.log(message);
                break;
        }
    });
});

module.exports = app;
module.exports.handler = serverless(app);