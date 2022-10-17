const discordApiClient = require("./adapters/discordApiClient");
const discordHelper = require("../helpers/discord");

const { DISCORD_TOKEN } = process.env;

async function getToken(code) {
  return await discordApiClient.exchangeCode(code);
}

async function refreshToken(refreshToken) {
  return await discordApiClient.refreshToken(refreshToken);
}

async function getUser(accessToken) {
  const user = await discordApiClient.getCurrentUser(`Bearer ${accessToken}`);
  return discordHelper.transformUser(user);
}

async function getUserGuilds(accessToken, params) {
  const guilds = await discordApiClient.getCurrentUserGuilds(`Bearer ${accessToken}`, params);
  return guilds.map(discordHelper.transformGuild);
}

async function getBotGuilds() {
  let foundAll = false;
  let after;
  const guilds = [];

  // Iterate over all pages of guilds because bot can join more than the default 200 servers limit
  while (!foundAll) {
    const guildList = await discordApiClient.getCurrentUserGuilds(`Bot ${DISCORD_TOKEN}`, { limit: 200, after });
    guilds.push(...guildList);

    after = guilds[guilds.length - 1].id;
    if (guildList.length < 200) foundAll = true;
  }

  return guilds.map(discordHelper.transformGuild);
}

async function getGuild(guildId) {
  const guild = await discordApiClient.getGuild(`Bot ${DISCORD_TOKEN}`, guildId);
  return discordHelper.transformGuild(guild);
}

async function getGuildChannels(guildId) {
  const channels = await discordApiClient.getGuildChannels(`Bot ${DISCORD_TOKEN}`, guildId);
  return channels.map(discordHelper.transformChannel);
}

async function leaveGuild(guildId) {
  await discordApiClient.leaveGuild(`Bot ${DISCORD_TOKEN}`, guildId);
  return true;
}

module.exports = {
  getBotGuilds,
  getGuild,
  getGuildChannels,
  getToken,
  getUser,
  getUserGuilds,
  leaveGuild,
  refreshToken,
};
