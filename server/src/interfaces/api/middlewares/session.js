const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const { client } = require("../../../adapters/mongoDbClient");

const { SESSION_COOKIE_NAME = "albion-killbot", SESSION_SECRET = "defaultSecret", MONGODB_URL } = process.env;

const session = expressSession({
  cookie: {
    maxAge: 604800000, // 7 days
    secure: "auto",
  },
  name: SESSION_COOKIE_NAME,
  proxy: true,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  store: MongoStore.create({
    client,
    mongoUrl: MONGODB_URL,
    touchAfter: 24 * 3600,
  }),
  unset: "destroy",
});

module.exports = {
  session,
};
