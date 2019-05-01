const { Client } = require("pg");

const client = new Client({
  connectionString: "postgres://bright:1NIGeria@localhost:5432/reflection_db"
});

client.connect();

module.exports = client;