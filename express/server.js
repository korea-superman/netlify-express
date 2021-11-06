const express = require("express");
const app = express()

app.get("/", (req, res) => {
	res.send("<html><body><h1>Helo World</h1></body></html>");
});

app.listem(80, () => {
	console.log("server listen on 80 port");
});