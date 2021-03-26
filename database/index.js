const { Pool } = require('pg');

const db = new Pool({
  host: 'localhost',
  user: 'erichernandez',
  database: 'sdc'
});

// db.connect((err) => {
//   if (err) {
//     console.log('error connecting to db', err);
//   } else {
//     console.log('connected to db');
//   }
// });

module.exports = db;
