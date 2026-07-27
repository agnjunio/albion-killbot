const { equalsCaseInsensitive } = require("./utils");
const { EVENT_CATEGORIES, EVENT_TYPES } = require("./constants");

const applyLimitsToTrack = (track, limits) => {
  let players = track.players || [];
  if (!isNaN(limits.players)) players = players.slice(0, Math.max(0, limits.players));

  let guilds = track.guilds || [];
  if (!isNaN(limits.guilds)) guilds = guilds.slice(0, Math.max(0, limits.guilds));

  let alliances = track.alliances || [];
  if (!isNaN(limits.alliances)) alliances = alliances.slice(0, Math.max(0, limits.alliances));

  return {
    players,
    guilds,
    alliances,
  };
};

function findTrackItemForPlayer(player, { players, guilds, alliances }, eventServer) {
  if (!player) return null;

  const playerTrack = players.find((t) => t.server === eventServer && t.id === player.Id);
  if (playerTrack) return playerTrack;

  if (player.GuildId) {
    const guildTrack = guilds.find((t) => t.server === eventServer && t.id === player.GuildId);
    if (guildTrack) return guildTrack;
  }

  if (player.AllianceId) {
    const allianceTrack = alliances.find((t) => t.server === eventServer && t.id === player.AllianceId);
    if (allianceTrack) return allianceTrack;
  }

  return null;
}

// This method checks if an event is tracked by a discord server for the matched track item.
// It sets two independent flags on the result:
// - type: the underlying nature of the event (kill/death/assist), always accurate regardless
//   of where it gets routed. Used by embeds for title/color.
// - category: which settings section/channel the event is routed to (kills/deaths/assists,
//   or depths when the event happened in Depths).
function getTrackedEvent(event, track, limits) {
  const { players, guilds, alliances } = applyLimitsToTrack(track, limits);

  if (players.length === 0 && guilds.length === 0 && alliances.length === 0) {
    return null;
  }

  const depthsCategory = event.Location === "Depths" ? EVENT_CATEGORIES.DEPTHS : null;

  // Check if the killer is tracked
  let trackItem = findTrackItemForPlayer(event.Killer, { players, guilds, alliances }, event.server);
  if (trackItem) {
    return Object.assign({}, event, {
      type: EVENT_TYPES.KILL,
      category: depthsCategory || EVENT_CATEGORIES.KILLS,
      trackItem,
    });
  }

  // Check if the victim is tracked
  trackItem = findTrackItemForPlayer(event.Victim, { players, guilds, alliances }, event.server);
  if (trackItem) {
    return Object.assign({}, event, {
      type: EVENT_TYPES.DEATH,
      category: depthsCategory || EVENT_CATEGORIES.DEATHS,
      trackItem,
    });
  }

  // Check if any other participant is tracked
  if (event.numberOfParticipants > 1 && Array.isArray(event.Participants)) {
    for (const participant of event.Participants) {
      if (participant.Id === event.Killer.Id || participant.Id === event.Victim.Id) continue;

      trackItem = findTrackItemForPlayer(participant, { players, guilds, alliances }, event.server);
      if (trackItem) {
        return Object.assign({}, event, {
          type: EVENT_TYPES.ASSIST,
          category: depthsCategory || EVENT_CATEGORIES.ASSISTS,
          trackItem,
          assistPlayer: participant,
        });
      }
    }
  }

  return null;
}

// This method checks if a battle is tracked by a discord server
// and returns the battle or null if the event is not tracked at all
function getTrackedBattle(battle, track, limits) {
  const { players, guilds, alliances } = applyLimitsToTrack(track, limits);

  if (players.length === 0 && guilds.length === 0 && alliances.length === 0) {
    return null;
  }

  // Ignore battles without fame
  if (battle.totalFame <= 0) {
    return null;
  }

  const playerIds = players.filter((item) => item.server === battle.server).map((item) => item.id);
  const guildIds = guilds.filter((item) => item.server === battle.server).map((item) => item.id);
  const allianceIds = alliances.filter((item) => item.server === battle.server).map((item) => item.id);

  // Check for tracked ids in players, guilds and alliances
  const hasTrackedPlayer = Object.keys(battle.players || {}).some((id) => playerIds.indexOf(id) >= 0);
  const hasTrackedGuild = Object.keys(battle.guilds || {}).some((id) => guildIds.indexOf(id) >= 0);
  const hasTrackedAlliance = Object.keys(battle.alliances || {}).some((id) => allianceIds.indexOf(id) >= 0);
  if (hasTrackedPlayer || hasTrackedGuild || hasTrackedAlliance) {
    return battle;
  }

  return null;
}

function isPlayerTracked(player, { players = [], guilds = [], alliances = [] }, { server }) {
  if (server) {
    players = players.filter((t) => t.server === server);
    guilds = guilds.filter((t) => t.server === server);
    alliances = alliances.filter((t) => t.server === server);
  }

  return (
    players.some((t) => t.id === player.Id) ||
    guilds.some((t) => t.id === player.GuildId) ||
    alliances.some((t) => t.id === player.AllianceId)
  );
}

const getTrackedItem = ({ id, name, server }, trackList) => {
  if (!server) return null;
  if (!name && !id) return null;

  return trackList
    .filter((trackItem) => trackItem.server === server)
    .find((trackItem) => {
      if (id && !trackItem.id !== id) return false;
      if (name && !equalsCaseInsensitive(trackItem.name, name)) return false;
      return true;
    });
};

const isTracked = ({ id, name, server }, trackList) => {
  if (!server) return false;
  if (!name && !id) return false;

  return !!getTrackedItem({ id, name, server }, trackList);
};

const hasMinimumTreshold = (battle, { players, guilds, alliances } = {}) => {
  if (!battle) return false;
  if (players && Object.keys(battle.players || {}).length < players) return false;
  if (guilds && Object.keys(battle.guilds || {}).length < guilds) return false;
  if (alliances && Object.keys(battle.alliances || {}).length < alliances) return false;
  return true;
};

module.exports = {
  getTrackedBattle,
  getTrackedEvent,
  getTrackedItem,
  hasMinimumTreshold,
  isPlayerTracked,
  isTracked,
};
