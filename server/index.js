const express = require('express');
const morgan = require('morgan');
const db = require('../database');

const PORT = 3000;

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Hello from server');
});

// get all products
app.get('/products', (req, res) => {

  db.query('SELECT * FROM products LIMIT 10')
  .then((data) => {
    res.status(200).send(data.rows);
  }).catch((err) => {
    console.log('error getting all products', err);
  })

});

// get product info
app.get('/products/:productId', (req, res) => {
  const { productId } = req.params;

  const sql = `
  SELECT row_to_json(p) 
  FROM (
    SELECT *,
    (
     SELECT array_to_json(array_agg(row_to_json(f)))
        FROM (
        SELECT feature, value
        FROM features
        WHERE product_id=products.id
    ) f
  ) AS features
  FROM products
  WHERE id = $1
  ) p
  `;

  db.query(sql, [productId])
  .then((data) => {
    res.status(200).send(data.rows[0].row_to_json);
  }).catch((err) => {
    console.log('error getting product info', err);
  })

});

// get product styles
app.get('/products/:productId/styles', (req, res) => {
  const { productId } = req.params;

  const sql = `SELECT style_id, name, original_price, sale_price, default_style FROM styles WHERE product_id=$1`;

  db.query(sql, [productId])
  .then((res) => {

    const promiseArray = [];

    res.rows.map((style) => {
      const queryString = `SELECT thumbnail_url, url FROM photos WHERE style_id=${style.style_id};
                           SELECT id, quantity, size FROM skus WHERE style_id=${style.style_id}`;

      const promise = db.query(queryString)
      .then((res) => {
        const skuObj = {};

        res[1].rows.forEach((item) => {
          const id = item.id;
          const info = {};
          info.size = item.size;
          info.quantity = item.quantity;
          skuObj[id] = info;
        });

        style.photos = res[0].rows;
        style.skus = skuObj;

        return style;
      })
      .catch((err) => 
      console.log(err));

      promiseArray.push(promise);
    })
    return Promise.all(promiseArray);
  })
  .then((result) => {
    const styleObj = {};

    styleObj.product_id = productId;
    styleObj.results = result;

    res.status(200).send(styleObj);
  }).catch((err) => {
    console.log(err);
  });

});

// get related products of current product
app.get('/products/:productId/related', (req, res) => {
  const { productId } = req.params;

  const sql = `
  SELECT 
  json_build_object(
    'related_products', json_agg(related_products.related_product_id)
  )
  FROM related_products
  WHERE current_product_id = $1
  `;

  db.query(sql, [productId])
  .then((data) => {
    res.status(200).send(data.rows[0].json_build_object.related_products);
  }).catch((err) => {
    console.log('error gettingrelated products', err);
  })

});

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});