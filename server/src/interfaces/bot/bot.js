const Discord = require("discord.js");
const database = require("../../ports/database");
const logger = require("../../helpers/logger");
const queue = require("../../ports/queue");

const events = require("./controllers/events");
const battles = require("./controllers/battles");

// const COMMAND_PREFIX = "!";
// const FREQ_HOUR = 1000 * 60 * 60;
// const FREQ_DAY = FREQ_HOUR * 24;

const client = new Discord.Client({
  autoReconnect: true,
});

// client.commands = commands;
client.on("shardReady", async (id) => {
  client.shardId = id;
  const shardPrefix = `[#${id}]`;
  logger.info(`${shardPrefix} Shard ready as ${client.user.tag}. Guild count: ${client.guilds.cache.size}`);

  try {
    await events.subscribe({
      queueSuffix: client.shardId,
    });
    logger.info(`${shardPrefix} Subscribed to events queue.`);

    await battles.subscribe({
      queueSuffix: client.shardId,
    });
    logger.info(`${shardPrefix} Subscribed to battles queue.`);
  } catch (e) {
    logger.error(e.stack);
  }

  // runDaily(guilds.showRanking, "Display Guild Rankings", exports);
  // runDaily(dailyRanking.scanDaily, "Display Player Ranking (daily)", exports, 0, 0);
  // runInterval(subscriptions.refresh, "Refresh subscriptions", exports, FREQ_DAY, true);
  // runInterval(guilds.update, "Get Guild Data", exports, FREQ_DAY / 4, true);
  // runInterval(dailyRanking.scan, "Display Player Ranking", exports, FREQ_HOUR);
});

client.on("shardDisconnect", async (ev, id) => {
  logger.info(`[#${id}] Disconnected from Discord: [${ev.code}] ${ev.reason}`);
  queue.unsubscribeAll();
});

client.on("shardReconnecting", async (id) => {
  logger.info(`[#${id}] Trying to reconnect to Discord.`);
  queue.unsubscribeAll();
});

client.on("error", async (e) => {
  logger.error(`Discord error: ${e.stack}`);
});

// client.on("message", async (message) => {
//   if (!message.guild) return;
//   // Fetch guild config and create default if not config is found
//   const guild = message.guild;
//   guild.config = await config.getConfig(guild);
//   if (!guild.config) {
//     logger.info(`Guild "${guild.name}" has no configuration. Creating default settings.`);
//     guild.config = await config.setConfig(guild);
//   }
//   const prefix = guild.config.prefix || COMMAND_PREFIX;

//   if (message.author.bot) return;
//   if (!message.content || !message.content.startsWith(prefix)) return;
//   if (!message.member) return;
//   // For now, bot only accepts commands from server admins
//   if (!message.member.hasPermission("ADMINISTRATOR")) return;

//   const args = message.content.slice(prefix.length).trim().split(/ +/g);
//   const command = commands[args.shift().toLowerCase()];
//   if (!command) return;
//   if (!subscriptions.hasSubscription(guild.config) && !command.public) return;

//   await command.run(client, guild, message, args);

//   if (!guild.config.channel) {
//     const l = messages.getI18n(guild);
//     message.channel.send(l.__("CHANNEL_NOT_SET"));
//   }
// });

// client.on("guildCreate", async (guild) => {
//   logger.info(`Joined guild "${guild.name}". Creating default settings.`);
//   guild.config = await config.setConfig(guild);
//   const l = messages.getI18n(guild);
//   exports.sendGuildMessage(guild, l.__("JOIN"));
// });

// client.on("guildDelete", (guild) => {
//   logger.info(`Left guild "${guild.name}". Deleting settings.`);
//   config.deleteConfig(guild);
// });

// exports.getDefaultChannel = (guild) => {
//   // Get "original" default channel
//   if (guild.channels.cache.has(guild.id)) return guild.channels.cache.get(guild.id);

//   // Check for a "general" channel, which is often default chat
//   const generalChannel = guild.channels.cache.find((channel) => channel.name === "general");
//   if (generalChannel) return generalChannel;
//   // Now we get into the heavy stuff: first channel in order where the bot can speak
//   // hold on to your hats!
//   return guild.channels.cache
//     .filter((c) => c.type === "text" && c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
//     .sort((a, b) => a.position - b.position)
//     .first();
// };

// const msgErrors = {};
// exports.sendGuildMessage = async (guild, message, category = "general") => {
//   if (!guild.config) guild.config = await config.getConfig(guild);
//   if (!guild.config.categories) guild.config.categories = {};
//   if (guild.config.categories[category] === false) return;

//   let channelId;
//   // Old structure backport
//   if (guild.config.channel) {
//     if (typeof guild.config.channel === "string") channelId = guild.config.channel;
//     else channelId = guild.config.channel[category] || guild.config.channel.general;
//   }

//   const l = messages.getI18n(guild);
//   const channel = client.channels.cache.find((c) => c.id === channelId) || exports.getDefaultChannel(guild);
//   if (!channel) return;
//   try {
//     await channel.send(message);
//     msgErrors[guild.id] = 0;
//   } catch (e) {
//     logger.error(`Unable to send message to guild ${guild.name}/${channel.name}: ${e}`);

//     if (
//       e.code === Discord.Constants.APIErrors.UNKNOWN_CHANNEL ||
//       e.code === Discord.Constants.APIErrors.MISSING_ACCESS ||
//       e.code === Discord.Constants.APIErrors.MISSING_PERMISSIONS
//     ) {
//       if (!msgErrors[guild.id]) msgErrors[guild.id] = 0;
//       msgErrors[guild.id]++;
//       // If more than 50 msg errors occur in succession, bot will leave and warn owner
//       if (msgErrors[guild.id] > 50) {
//         logger.warn(`Leaving guild ${guild.name} due to excessive message errors. Warning owner.`);
//         await guild.owner.send(l.__("LEAVE", { guild: guild.name }));
//         await guild.leave();
//         msgErrors[guild.id] = 0;
//       }
//     }
//   }
// };

async function run() {
  await queue.init();
  await database.init();
  await client.login();
}

// If the file is called directly instead of required, run it
if (require.main == module) {
  (async () => {
    try {
      await run();
    } catch (e) {
      logger.error(e.stack);
      process.exit(1);
    }
  })();
}

module.exports = {
  client,
  run,
};
