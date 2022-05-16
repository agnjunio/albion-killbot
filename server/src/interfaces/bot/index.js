const { ShardingManager } = require("discord.js");
const path = require("node:path");
const logger = require("../../helpers/logger");
const { runDaily } = require("../../helpers/utils");

let manager;

async function run() {
  const { DISCORD_TOKEN, TOTAL_SHARDS } = process.env;
  if (!DISCORD_TOKEN) {
    throw new Error("Please define DISCORD_TOKEN environment variable with the discord token.");
  }

  logger.info(`Starting Bot...`);

  const botFile = path.join(__dirname, "bot.js");
  require(botFile); // This can throw errors before spawning, preventing inconsistencies

  manager = new ShardingManager(botFile, {
    token: DISCORD_TOKEN,
    totalShards: TOTAL_SHARDS || "auto",
  });
  manager.spawn();

  runDaily("Clear daily ranking", () => {}, { hour: 0, minute: 10 });
}

async function cleanup(e) {
  if (e) {
    logger.error(e.stack);
  }
  logger.info(`Shutting down Bot...`);

  for (const shard of manager.shards.values()) {
    logger.debug(`Killing shard ${shard.id}`);
    await shard.kill();
  }
}

module.exports = {
  run,
  cleanup,
};
