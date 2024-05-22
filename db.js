const { Pool } = require("pg");

const poolUser = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "fakhir",
  port: "5432",
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 500,
});

module.exports = {
  poolUser

};

