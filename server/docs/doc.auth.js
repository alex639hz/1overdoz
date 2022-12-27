const { USER_TYPES } = require('../config/config')
const { REGULAR } = require('../config/config')



const options = {
  'api/auth': {
    post: {
      tags: ['auth CRUD'],
      description: 'User signin',
      operationId: 'signin',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Auth'
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
  '/auth/{id}': {
    get: {
      tags: ["auth CRUD"], // operation's tag.
      description: "user signout", // operation's desc.
      operationId: "signout", // unique operation id
      parameters: [
        // expected params.
        {
          name: "id", // name of the param
          in: "path", // location of the param
          schema: {
            $ref: "#/components/schemas/id", // data model of the param
          },
          required: true, // Mandatory param
          description: "A single todo id", // param desc.
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
  },
}
module.exports = options;
// module.exports = openapiSpecification;