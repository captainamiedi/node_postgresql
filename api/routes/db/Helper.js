const { Client, pool } = require("pg");

const client = new Client({
  connectionString: "postgres://bright:1NIGeria@localhost:5432/people"
});

client.connect();

module.exports = client;
  