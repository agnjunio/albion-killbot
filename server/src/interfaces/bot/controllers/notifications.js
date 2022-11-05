const logger = require("../../../helpers/logger");
const { timeout } = require("../../../helpers/utils");

const NOTIFICATION_TIMEOUT = 10000;

async function sendNotification(client, channelId, message) {
  const channel = client.channels.cache.find((c) => c.id === channelId);
  if (!channel || !channel.send) return;
  if (!channel.guild) channel.guild = { name: "Unknown Guild" };

  logger.debug(`Sending notification to "${channel.guild.name}/#${channel.name}".`, {
    server: channel.guild,
    message,
  });
  try {
    await timeout(channel.send(message), NOTIFICATION_TIMEOUT);
  } catch (e) {
    logger.warn(`Unable to send notification to "${channel.guild.name}/#${channel.name}".`, {
      error: {
        message: e.message,
        stack: e.stack,
      },
    });
  }
}

module.exports = {
  sendNotification,
};
