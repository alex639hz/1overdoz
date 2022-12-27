
const swaggerJsdoc = require('swagger-jsdoc');

const USER_TYPES = ['A', 'B', 'C']
const REGULAR = 'A'

const components = {
  schemas: {
    // id model
    id: {
      type: "string", // data type
      description: "An id of a todo", // desc
      example: "tyVgf", // example of an id
    },
    // todo model
    Todo: {
      type: "object", // data type
      properties: {
        id: {
          type: "string", // data-type
          description: "Todo identification number", // desc
          example: "ytyVgh", // example of an id
        },
        title: {
          type: "string", // data-type
          description: "Todo's title", // desc
          example: "Coding in JavaScript", // example of a title
        },
        completed: {
          type: "boolean", // data type
          description: "The status of the todo", // desc
          example: false, // example of a completed value
        },
      },
    },
    // auth model
    Auth: {
      type: "object", // data type
      properties: {
        email: {
          type: "string",
          description: "user email account",
          example: "demo@site.com",
        },
        password: {
          type: "string",
          description: "password",
          example: "*******",
        },
      },
    },
    // Todo input model
    TodoInput: {
      type: "object", // data type
      properties: {
        title: {
          type: "string", // data type
          description: "Todo's title", // desc
          example: "Coding in JavaScript", // example of a title
        },
        completed: {
          type: "boolean", // data type
          description: "The status of the todo", // desc
          example: false, // example of a completed value
        },
      },
    },
    identificationNumber: {
      type: 'integer',
      description: 'User identification number',
      example: 1234
    },
    username: {
      type: 'string',
      example: 'raparicio'
    },
    userType: {
      type: 'string',
      enum: USER_TYPES,
      default: REGULAR
    },
    companyId: {
      type: 'integer',
      description: 'Company id where the user works',
      example: 15
    },
    User: {
      type: 'object',
      properties: {
        identificationNumber: {
          $ref: '#/components/schemas/identificationNumber'
        },
        username: {
          $ref: '#/components/schemas/username'
        },
        userType: {
          $ref: '#/components/schemas/userType'
        },
        companyId: {
          $ref: '#/components/schemas/companyId'
        }
      }
    },
    Users: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/User'
          }
        }
      }
    },
    // error model
    Error: {
      type: "object", //data type
      properties: {
        message: {
          type: "string", // data type
          description: "Error message", // desc
          example: "Not found", // example of an error message
        },
        internal_code: {
          type: "string", // data type
          description: "Error internal code", // desc
          example: "Invalid parameters", // example of an error internal code
        },
      },
    },
  },
}

module.exports = components;
