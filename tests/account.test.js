const request = require("supertest");
const app = require("../server/express");
const config = require("../server/config/config");
const { User } = require('../server/modules/user/user.model');
const { Keyword } = require('../server/modules/keyword/keyword.model');
const { Community } = require('../server/modules/community/community.model');
const { Post } = require('../server/modules/post/post.model');
const { Account } = require('../server/modules/tx/account.model');
const mongoose = require('mongoose');

/** user object:
{
  credentials: { password: 'aaaaaa', email: 'a@a.a' },
  _id: '615a9d1f98f842f6572d8625',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTVhOWQxZjk4Zjg0MmY2NTcyZDg2MjUiLCJpYXQiOjE2MzMzMjg0MTV9.ke-0u6sL8fJXzzSTkKRWGI1xiBlDT5ijv82tHZYPK30',
  country: 'IL'
}
 */
const user = {
  credentials: {
    password: "aaaaaa",
    email: `a@a.a`,
    role: 'moderator'
  }
}


let communityTitle = "A"
let keywords = [
  'word1',
  'word2',
]

let postsA = [
  generatePost("A", "US", 100, "word? word1 word2 word3"),
  generatePost("A", "IL", 90, "word? word? word? word?"),
  generatePost("A", "US", 80, "word? word? word? word?"),
  generatePost("A", "IL", 70, "word? word? word? word?"),
  generatePost("A", "IL", 60, "word? word? word? word?"),
  generatePost("A", "US", 100, "word? word? word? word?"),
  generatePost("A", "US", 98, "word? word? word? word?"),
  // generatePost("B", "US", 90, "word? word? word? word?"),
  // generatePost("B", "IL", 10, "word? word? word? word?"),
]

describe("Test the root path", () => {

  beforeAll(async () => {
    app.set('port', process.env.PORT || '3000');
    // mongoose.pluralize(null);
    mongoose.Promise = global.Promise
    mongoose.connect(config.mongoUris[0],
      {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false
      })

    mongoose.connection.on('error', () => {
      throw new Error(`unable to connect to database: ${config.mongoUris[0]}`)
    })
    config.mongooseInit(mongoose, config.mongoUris[0])

    // await User.deleteMany();
    // await Keyword.deleteMany();
    // await Community.deleteMany();
    // await Post.deleteMany();
    // await Tx.deleteMany();
    await Account.deleteMany();

  });

  afterAll((done) => {
    mongoose.disconnect();
    // server.close(done);
  });


  test("create account A", async () => {
    const url = "/api/account";
    const response = await request(app)
      .post(url)
      .set('Authorization', 'Bearer ' + user.token)
      .send({
        account: {
          owner: "1010",
          balance: 100,
          title: "initial",
        }
      })

    // console.log(response.body)
    printIfError(response)
    expect(response.statusCode).toBe(201);
  });

  for (let i = 0; i < 10; i++) {
    test("create tx", async () => {
      const url = "/api/account/tx";
      const response = await request(app)
        .post(url)
        .set('Authorization', 'Bearer ' + user.token)
        .send({
          tx: {
            sender: "1010",
            receiver: "1020",
            amount: 1,
            title: "initial" + i,
          }
        })

      // console.log('pppp', response.body)
      printIfError(response)
      expect(response.statusCode).toBe(201);
    });
  }

  test("should not accept duplicated tx", async () => {
    const url = "/api/account/tx";
    const response = await request(app)
      .post(url)
      .set('Authorization', 'Bearer ' + user.token)
      .send({
        tx: {
          sender: "1010",
          receiver: "1020",
          amount: 1,
          title: "initial0",
        }
      })

    // console.log('should not accept duplicated tx', response.body)
    // printIfError(response)
    expect(response.statusCode).toBe(400);
    // expect(response.body.message).toBe('tx already exist');
  });

  test("should not accept out of balance tx", async () => {
    const url = "/api/account/tx";
    const response = await request(app)
      .post(url)
      .set('Authorization', 'Bearer ' + user.token)
      .send({
        tx: {
          sender: "1010",
          receiver: "1020",
          amount: 500,
          title: "initial",
        }
      })

    // console.log('aaaaa', response.body)
    // printIfError(response)
    expect(response.statusCode).toBe(400);
    // expect(response.body.message).toBe('Failed to updated sender account!');
  });

});

function printIfError(response, label = '') {
  if (response.statusCode >= 400) {
    console.log(
      label,
      response.statusCode,
      response.body,
    )
  }
}

function randomSuffix(prefix) {
  return '' + prefix + Math.floor(Math.random() * 10000)
}

/** NOTE: scoreCalculator function is the example of 
 * how to calculate a score based on the post parameters and the rest of the posts 
 * 
 * @param {*} likesCounter the post likes count
 * @param {*} maxLikesCounter the post with highest likes count in the system
 * @param {*} postLength the post length
 * @param {*} maxPostLength the length of the 
 * @returns 
 */
function scoreCalculator(likesCounter, maxLikesCounter, postLength, maxPostLength) {
  return (likesCounter / maxLikesCounter) * 80 + (1 - postLength / maxPostLength) * 20
}

function generatePost(community = '', country = '', score, body = '') {
  return {
    title: randomSuffix("title-"),
    community,
    country,
    score,
    body: "my post body text includes word1 word2 word3.",
  }
}
