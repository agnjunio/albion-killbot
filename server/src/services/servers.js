const discord = require("../ports/discord");
const logger = require("../helpers/logger");

async function getServers(accessToken) {
  try {
    const botServerIds = (await discord.getBotGuilds()).map((s) => s.id);
    const servers = await discord.getMeGuilds(accessToken);

    return servers
      .filter((server) => server.owner || server.admin)
      .map((server) => {
        server.bot = botServerIds.indexOf(server.id) >= 0;
        return server;
      });
  } catch (e) {
    logger.error(`Error while retrieving user guilds:`, e);
    throw e;
  }
}

async function getServer(serverId) {
  try {
    const guild = await discord.getGuild(serverId);
    const channels = await discord.getGuildChannels(serverId);

    guild.channels = channels;

    return guild;
  } catch (e) {
    logger.error(`Error while retrieving discord server:`, e);
    throw e;
  }
}

module.exports = {
  getServer,
  getServers,
};
