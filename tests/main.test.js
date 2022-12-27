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

    await User.deleteMany();
    await Keyword.deleteMany();
    await Community.deleteMany();
    await Post.deleteMany();
    await Account.deleteMany();

  });

  afterAll((done) => {
    mongoose.disconnect();
    // server.close(done);
  });

  test("signup", async () => {
    const response = await request(app)
      .post("/api/user")
      .send(user.credentials);

    expect(response.statusCode).toBe(201);
    user._id = response.body._id
  });

  test("signin", async () => {
    const response = await request(app)
      .post("/api/auth/signin")
      .send(user.credentials);

    expect(response.statusCode).toBe(200);
    user.token = response.body.token
    user.country = response.body.country
  });

  test("faile without Bearer token", async () => {
    const response = await request(app)
      .get("/api/user")

    expect(response.statusCode).toBe(401);

  });

  test("pass with bearer token", async () => {
    const url = "/api/auth/secured-api-example"
    const response = await request(app)
      .get(url)
      .set('Authorization', 'Bearer ' + user.token)

    expect(response.statusCode).toBe(200);
  });

  test("add keywords", async () => {
    const response = await request(app)
      .post("/api/keyword")
      .set('Authorization', 'Bearer ' + user.token)
      .send(keywords)

    printIfError(response)
    expect(response.statusCode).toBe(201);

  });

  test("list keywords", async () => {
    const response = await request(app)
      .get("/api/keyword")
      .set('Authorization', 'Bearer ' + user.token)

    printIfError(response)
    expect(response.statusCode).toBe(200);

  });

  test("create community A", async () => {
    const url = "/api/community";
    const response = await request(app)
      .post(url)
      .set('Authorization', 'Bearer ' + user.token)
      .send({
        title: "A"
      })

    printIfError(response)
    expect(response.statusCode).toBe(201);
  });

  test("create community B", async () => {
    const url = "/api/community";
    const response = await request(app)
      .post(url)
      .set('Authorization', 'Bearer ' + user.token)
      .send({ title: 'B' })

    printIfError(response)
    expect(response.statusCode).toBe(201);
  });

  test("list communities", async () => {
    const url = "/api/community";

    const response = await request(app)
      .get(url)
      .set('Authorization', 'Bearer ' + user.token)

    printIfError(response)
    expect(response.statusCode).toBe(200);
  });

  test("deny post without membership", async () => {
    const url = `/api/post/${communityTitle}`;

    const response = await request(app)
      .post(url)
      .set('Authorization', 'Bearer ' + user.token)
      .send()

    expect(response.statusCode).toBe(400);
  });

  test("request community A membership", async () => {
    const url = `/api/community/member-request/${communityTitle}`;

    const response = await request(app)
      .patch(url)
      .set('Authorization', 'Bearer ' + user.token)
      .send()

    printIfError(response)
    expect(response.statusCode).toBe(200);
  });

  test("approve community A membership", async () => {
    const url = `/api/community/member-approve/${communityTitle}`;

    const response = await request(app)
      .patch(url)
      .set('Authorization', 'Bearer ' + user.token)
      .send({ pendingMember: user._id })

    printIfError(response)
    expect(response.statusCode).toBe(200);
  });

  //generate posts collection
  postsA.map((post, idx) => {
    let postId = ""

    test("create a post", async () => {
      const url = `/api/post`;
      const response = await request(app)
        .post(url)
        .set('Authorization', 'Bearer ' + user.token)
        .send({ post })

      printIfError(response)
      expect(response.statusCode).toBe(201);
      expect(response.body.post.status).toBe("pending");

      postId = response.body.post._id
    })

    if (idx % 2) {
      test("approve a post", async () => {
        const url = `/api/post/${postId}/approve`;

        const response = await request(app)
          .patch(url)
          .set('Authorization', 'Bearer ' + user.token)
          .send({ postId })

        printIfError(response)
        expect(response.statusCode).toBe(200);
      })
    }

  })

  test("Get Feed", async () => {
    const url = `/api/post`

    const response = await request(app)
      .get(url)
      .set('Authorization', 'Bearer ' + user.token)

    // console.log(response.body)

    expect(response.statusCode).toBe(200);
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
