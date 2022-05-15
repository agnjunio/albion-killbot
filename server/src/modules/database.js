const MongoClient = require("mongodb").MongoClient;
const logger = require("./logger")("database");
const { sleep } = require("./utils");

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  logger.warn(
    "Please define MONGODB_URL environment variable with the MongoDB location. Server config persistence is disabled.",
  );
  process.exit(1);
}

const client = new MongoClient(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    wtimeout: 60000,
  },
});
let db;

const isConnected = () => {
  return !!client && !!client.topology && client.topology.isConnected();
};

const checkConnection = async () => {
  const exit = false;
  while (!exit) {
    try {
      if (!isConnected()) {
        logger.debug("Connecting to database...");
        await client.connect();
        logger.info("Connection to database stabilished.");
        db = client.db();
      }
      await sleep(60000);
    } catch (e) {
      logger.error(`Unable to connect to database: ${e}`);
      await sleep(5000);
    }
  }
};

exports.connect = async () => {
  while (!isConnected()) {
    try {
      logger.debug("Connecting to database...");
      await client.connect();
      logger.info("Connection to database stabilished.");
      db = client.db();
      checkConnection();
      return db;
    } catch (e) {
      logger.error(`Unable to connect to database: ${e}`);
      await sleep(5000);
    }
  }
};
exports.db = () => db;
exports.collection = (collection) => {
  if (!db) return;
  return db.collection(collection);
};
