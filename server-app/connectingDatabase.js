const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DailyFitness',
  password: '135792468i',
  port: 5432,
})

module.exports = pool;