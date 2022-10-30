const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/script', (req, res) => {
  res.sendFile('script.js', { root: './public/' });
})

app.get('/fetch', (req, res) => {
    console.log("Intercepted url - " + req.query.url);
    res.sendStatus(200);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})

