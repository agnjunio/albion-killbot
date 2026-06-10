/* eslint-disable no-case-declarations */
const discord = require("../ports/discord");
const logger = require("../helpers/logger");
const settingsService = require("./settings");
const { embedEvent, embedEventImage, embedBattle, embedRanking } = require("../helpers/embeds");
const { generateEventImage } = require("./images");
const { EVENT_TYPES } = require("../helpers/constants");
const FAKE_EVENT = require("../assets/mocks/event_934270718.json");
const FAKE_GOOD_EVENT = require("../assets/mocks/event_1000422003.json");
const FAKE_INSANE_EVENT = require("../assets/mocks/event_1000545635.json");
const FAKE_BATTLE = require("../assets/mocks/battle_934264285.json");
const FAKE_PVP_RANKING = require("../assets/mocks/ranking_daily.json");
const axios = require("axios");
const botGuildsService = require("./botGuilds");

async function getBotServers({ search, page, pageSize } = {}) {
  try {
    return await botGuildsService.findBotGuilds({ search, page, pageSize });
  } catch (error) {
    logger.error(`Error while retrieving bot servers: ${error.message}`, { error });
    throw error;
  }
}

async function getServers(accessToken) {
  try {
    const servers = await discord.getUserGuilds(accessToken);
    const isAdminServer = (server) => server.owner || server.admin;
    const adminServers = servers.filter(isAdminServer);
    const botPresence = await discord.hasBotInGuilds(adminServers.map((server) => server.id));

    return servers.map((server) => {
      server.bot = isAdminServer(server) ? botPresence[server.id] ?? false : false;
      return server;
    });
  } catch (error) {
    logger.error(`Error while retrieving user guilds: ${error.message}`, { error });
    throw error;
  }
}

async function getServer(serverId) {
  try {
    return await discord.getGuild(serverId);
  } catch (error) {
    if (error.response.status === 404) return null;

    logger.error(`Error while retrieving discord server: ${error.message}`, { error });
    throw error;
  }
}

async function getServerChannels(serverId) {
  try {
    return await discord.getGuildChannels(serverId);
  } catch (error) {
    logger.error(`Error while retrieving discord channels: ${error.message}`, { error });
    throw error;
  }
}

async function leaveServer(serverId) {
  try {
    await botGuildsService.removeBotGuild(serverId);
    return await discord.leaveGuild(serverId);
  } catch (error) {
    logger.error(`Error while leaving discord server: ${error.message}`, { error });
    throw error;
  }
}

async function addMemberRole(serverId, userId, roleId, reason) {
  try {
    return await discord.addMemberRole(serverId, userId, roleId, reason);
  } catch (error) {
    logger.error(`Error while adding user role: ${error.message}`, {
      serverId,
      userId,
      roleId,
      error,
    });
    return null;
  }
}

async function removeMemberRole(serverId, userId, roleId, reason) {
  try {
    return await discord.removeMemberRole(serverId, userId, roleId, reason);
  } catch (error) {
    logger.error(`Error while removing user role: ${error.message}`, {
      serverId,
      userId,
      roleId,
      error,
    });
    return null;
  }
}

async function testNotification(serverId, { channelId, type = EVENT_TYPES.KILLS, mode = "image" } = {}) {
  try {
    if (!channelId) {
      const settings = await settingsService.getSettings(serverId);
      channelId = settings[type].channel;
    }

    const actions = new Map();
    actions.set("event.text", async (event) => {
      await discord.sendMessage(channelId, embedEvent(event, { test: true }));
      return true;
    });
    actions.set("event.image", async (event) => {
      const image = await generateEventImage(event);
      await discord.sendMessage(channelId, embedEventImage(event, image, { test: true }));
      return true;
    });

    let action;
    switch (type) {
      case EVENT_TYPES.KILLS:
      case EVENT_TYPES.DEATHS:
        action = `event.${mode}`;
        if (!actions.has(action) || typeof actions.get(action) !== "function") throw new Error(`Unknown mode ${mode}`);
        return await actions.get(action)({
          ...FAKE_EVENT,
          good: type === EVENT_TYPES.KILLS,
          eventType: type,
        });
      case EVENT_TYPES.ASSISTS: {
        action = `event.${mode}`;
        if (!actions.has(action) || typeof actions.get(action) !== "function") throw new Error(`Unknown mode ${mode}`);
        const assistPlayer = FAKE_INSANE_EVENT.Participants.find(
          (participant) =>
            participant.Id !== FAKE_INSANE_EVENT.Killer.Id && participant.Id !== FAKE_INSANE_EVENT.Victim.Id,
        );
        return await actions.get(action)({
          ...FAKE_INSANE_EVENT,
          eventType: EVENT_TYPES.ASSISTS,
          assistPlayer,
        });
      }
      case "good":
        action = `event.${mode}`;
        if (!actions.has(action) || typeof actions.get(action) !== "function") throw new Error(`Unknown mode ${mode}`);
        return await actions.get(action)({ ...FAKE_GOOD_EVENT, juicy: "good" });
      case "insane":
        action = `event.${mode}`;
        if (!actions.has(action) || typeof actions.get(action) !== "function") throw new Error(`Unknown mode ${mode}`);
        return await actions.get(action)({ ...FAKE_INSANE_EVENT, juicy: "insane" });
      case "battles":
        await discord.sendMessage(channelId, embedBattle(FAKE_BATTLE, { test: true }));
        return true;
      case "rankings":
        await discord.sendMessage(channelId, embedRanking(FAKE_PVP_RANKING, { test: true }));
        return true;
      default:
        throw new Error(`Unkown type ${type}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response.status === 403) {
      return false;
    }
    logger.error(`Error while sending test to server: ${error.message}`, {
      error,
      serverId,
      type,
    });
    throw error;
  }
}

module.exports = {
  addMemberRole,
  getBotServers,
  getServer,
  getServerChannels,
  getServers,
  leaveServer,
  removeMemberRole,
  testNotification,
};
