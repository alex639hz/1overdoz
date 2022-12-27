
const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config/config')
const authDoc = require('./doc.auth');
const userDoc = require('./doc.user');
const componentsDoc = require('./doc.components');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'myApp',
      description: 'OK',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${config.port}/`, // url
        description: "Local server", // name
      },
    ],
    tags: [
      { name: "user CRUD", },
      { name: "auth CRUD", },
      { name: "keyword CRUD", },
      { name: "community CRUD", },
      { name: "post CRUD", },
    ],
    components: componentsDoc,
    paths: {
      ...authDoc,
      ...userDoc,
    },
  },
  apis: [
    './example/routes*.js',
    './example/parameters.yaml'
  ],
}

module.exports = swaggerJsdoc(options);

// ✓ signup (85 ms)
// ✓ signin (21 ms)
// ✓ faile without Bearer token (11 ms)
// ✓ pass with bearer token (13 ms)
// ✓ add keywords (36 ms)
// ✓ list keywords (13 ms)
// ✓ add community (27 ms)
// ✓ list communities (15 ms)
// ✓ deny post without membership (23 ms)
// ✓ request community membership  (20 ms)
// ✓ deny 2nd request community membership (15 ms)
// ✓ approve community membership  (26 ms)
// ✓ deny 2nd approve community membership  (25 ms)
// ✓ generate posts collection (34 ms)
// ✓ generate posts collection (28 ms)
// ✓ generate posts collection (27 ms)
// ✓ generate posts collection (38 ms)
// ✓ generate posts collection (41 ms)
// ✓ generate posts collection (40 ms)
// ✓ list post (70 ms)