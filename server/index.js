const express = require('express');
const morgan = require('morgan');
const db = require('../database');
// const axios = require('axios');

const PORT = 3000;

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Hello from server');
});

app.get('/api/products', (req, res) => {

  db.getAllProducts((err, results) => {
    if (err) {
      res.status(500).send('error at server getting products', err);
    } else {
      res.status(200).send(results.rows);
    }
  });

});

app.get('/api/products/:productId', (req, res) => {
  const id = req.params.productId;

  console.log(id);

  db.getAllProductInformation(id, (err, results) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.status(200).send(results.rows[0].row_to_json);
    }
  });

});

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});