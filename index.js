const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/script', (req, res) => {
  res.sendFile('script.js', { root: './public/' });
})

app.get('/fetch', (req, res) => {
    console.log("Intercepted url - " + req.query.url);
    res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

