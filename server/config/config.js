const mongooseInit = async (mongoose) => {
  mongoose.pluralize(null);
  mongoose.set('debug', false);
  mongoose.set('autoIndex', true);
  mongoose.Promise = Promise
}

const config = {
  env: process.env.NODE_ENV || "development",

  port: process.env.PORT || 3000,

  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",

  mongoUris: [
    `mongodb://${process.env.IP || "localhost"}:${
      process.env.MONGO_PORT || "27017"
    }/MYAPP`,
  ],

  mongooseInit,

  mongoDropDb: async () => {
    await mongoose.connection.db.dropDatabase();
  },

  topicsNames: {
    keywordAlertTopic: "keyword-alert",
    serviceGetStatusOfFailedTx: "tx-failure",
  },
};

module.exports = config;
