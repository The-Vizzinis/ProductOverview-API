const { Pool } = require('pg');

const db = new Pool({
  host: '172.31.43.91',
  user: 'postgres',
  password: 'JinSin6$71',
  database: 'postgres'
});

// db.connect((err) => {
//   if (err) {
//     console.log('error connecting to db', err);
//   } else {
//     console.log('connected to db');
//   }
// });

module.exports = db;
