
const swaggerJsdoc = require('swagger-jsdoc');

const { USER_TYPES } = require('../config/config')
const { REGULAR } = require('../config/config')

const options = {
  '/api/user': {
    post: {
      tags: ['user CRUD'],
      description: 'Create users',
      operationId: 'createUsers',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Users'
            }
          }
        },
        required: true
      },
      responses: {
        '200': {
          description: 'New users were created'
        },
        '400': {
          description: 'Invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'User identificationNumbers 10, 20 already exist',
                internal_code: 'invalid_parameters'
              }
            }
          }
        }
      }
    }
  },
  '/user/{id}': {
    get: {
      tags: ["user CRUD"], // operation's tag.
      description: "read user profile", // operation's desc.
      operationId: "userRead", // unique operation id
      parameters: [
        // expected params.
        {
          name: "id", // name of the param
          in: "path", // location of the param
          schema: {
            $ref: "#/components/schemas/id", // data model of the param
          },
          required: true, // Mandatory param
          description: "user ID", // param desc.
        },
      ],
      // expected responses
      responses: {
        // response code
        200: {
          description: "Todo is obtained", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Todo", // todo data model
              },
            },
          },
        },
        // response code
        404: {
          description: "Todo is not found", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error", // error data model
              },
            },
          },
        },
      },
    },
    put: {
      tags: ["user CRUD"],
      description: "update user account",
      operationId: "getTodo",
      parameters: [
        {
          name: "id",
          in: "path",
          schema: {
            $ref: "#/components/schemas/id",
          },
          required: true,
          description: "user ID",
        },
      ],
      responses: {
        200: {
          description: "Todo is obtained", // response desc.
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Todo", // todo data model
              },
            },
          },
        },
        404: {
          description: "Todo is not found", // response desc.
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error", // error data model
              },
            },
          },
        },
      },
    },
  }

}

module.exports = options;
// module.exports = openapiSpecification;