const express = require('express');
const app = express();

app.get("/", (req, resp) => {
   resp.send("Olá...");
});

app.listen(3000);