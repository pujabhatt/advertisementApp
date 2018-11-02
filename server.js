let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = 5000;

app.post('/todos', (req, res) => {
    let todo = new Todo({
      text: req.body.text
    })
   
    todo.save().then((doc) => {
      res.send(doc)
    }, (e) => {
      res.status(400).send(e)
    })
  })