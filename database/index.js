const { Client } = require('pg');

const db = new Client({
  host: 'localhost',
  user: 'erichernandez',
  database: 'sdc'
});

db.connect((err, result) => {
  if (err) {
    console.log('error connecting to db', err);
  } else {
    console.log('connected to db');
  }
});

const getAllProducts = function(callback) {

  db.query('SELECT * FROM products LIMIT 10', (err, result) => {
    if (err) {
      console.log('error getting all products', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });

}

const getAllProductInformation = function(productId, callback) {

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
  ) p`;

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.log('error getting product information', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });

}

module.exports = {
  getAllProducts,
  getAllProductInformation
};