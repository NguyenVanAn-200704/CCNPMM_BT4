// src/config/elasticClient.js
const { Client } = require("@elastic/elasticsearch");

const elasticClient = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "rGsNRSs0wY8ijSkeZbqj", // thay bằng password reset
  },
  tls: {
    rejectUnauthorized: false, // cho self-signed cert
  },
});

module.exports = { elasticClient };
