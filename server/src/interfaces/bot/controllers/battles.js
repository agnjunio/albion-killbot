const logger = require("../../../helpers/logger");
const { getTrackedBattle } = require("../../../helpers/tracking");

const { subscribeBattles } = require("../../../services/battles");
const { getSettingsForServer } = require("../../../services/settings");
const { getTrackForServer } = require("../../../services/track");

const { embedBattle } = require("../../../helpers/embeds");

const { sendNotification } = require("./notifications");

async function subscribe(client) {
  const { shardId } = client;

  const cb = async (battle) => {
    logger.debug(`Received battle: ${battle.id}`);

    try {
      const settingsByGuild = await getSettingsForServer(client.guilds.cache);
      const trackByGuild = await getTrackForServer(client.guilds.cache);

      for (const guild of client.guilds.cache.values()) {
        if (!settingsByGuild[guild.id]) continue;
        guild.settings = settingsByGuild[guild.id];

        const guildBattle = getTrackedBattle(battle, trackByGuild[guild.id]);
        if (!guildBattle) continue;

        const { enabled, channel } = guild.settings.battles;
        if (!enabled || !channel) continue;

        logger.info(`[#${shardId}] Sending battle ${battle.id} to "${guild.name}".`);
        await sendNotification(client, channel, embedBattle(battle, guild.settings.lang));
      }
    } catch (e) {
      logger.error(`[#${shardId}] Error while processing battle ${battle.id}:`, e);
    }

    return true;
  };

  return await subscribeBattles(shardId, cb);
}

module.exports = {
  subscribe,
};
