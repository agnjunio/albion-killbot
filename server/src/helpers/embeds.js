const moment = require("moment");
const { REPORT_PROVIDERS, EVENT_TYPES } = require("./constants");
const { getLocale } = require("./locale");
const { digitsFormatter, humanFormatter } = require("./utils");
const { SERVER_LIST } = require("./albion");
const { truncateDiscordText, DISCORD_MESSAGE_CONTENT_MAX } = require("./discordLimits");
const { formatPanelMessageContent, formatTableLines, wrapLinesInCodeBlock } = require("./table");
const { Markers } = require("./markers");

const BATTLE = 16752981;

const RANKING_NAME_COL_WIDTH = 24;
const RANKING_SCORE_COL_WIDTH = 10;

const COLORS = {
  LIGHT_GREEN: 0x57ad65,
  LIGHT_RED: 0xed4f4f,

  DARK_GREEN: 52224,
  DARK_AMBER: 0xb8860b,

  BLUE: 3447003,
  GREEN: 5763719,
  GREY: 0xdcdfdf,
  PURPLE: 10181046,
  RED: 13369344,
  YELLOW: 16776960,
  GOLD: 15844367,
};

const MAXLEN = {
  TITLE: 256,
  DESCRIPTION: 2048,
  FIELD: {
    NAME: 256,
    VALUE: 1024,
    COUNT: 25,
  },
  FOOTER: 2048,
  AUTHOR: 256,
};

const getEventColor = (event) => {
  if (event.juicy)
    return (
      {
        good: COLORS.GOLD,
        insane: COLORS.YELLOW,
      }[event.juicy] || COLORS.GREY
    );
  if (event.type === EVENT_TYPES.ASSIST) return COLORS.DARK_AMBER;
  if (event.type === EVENT_TYPES.KILL) return COLORS.DARK_GREEN;
  if (event.type === EVENT_TYPES.DEATH) return COLORS.RED;
  return COLORS.GREY;
};

const getEventTitle = (event, t, { guildTags = false } = {}) => {
  const isDeath = event.type === EVENT_TYPES.DEATH;

  return t(isDeath ? "KILL.DEATH_TITLE" : "KILL.KILL_TITLE", {
    killer: getPlayerName(event, "Killer", { guildTags }),
    victim: getPlayerName(event, "Victim", { guildTags }),
  });
};

const getPlayerName = (event, player, { guildTags = false }) => {
  let name = "";

  if (player === "Victim") {
    if (event.juicy === "good") name += ":moneybag: ";
    if (event.juicy === "insane") name += ":star: ";
  }

  if (guildTags && event[player].GuildName) {
    name += `[${event[player].GuildName}] `;
  }
  name += event[player].Name;

  if (player === "Victim") {
    if (event.juicy === "good") name += " :moneybag:";
    if (event.juicy === "insane") name += " :star:";
  }

  return name;
};

const footer = {
  text: "Powered by Albion Killbot",
};

const embedEvent = (event, { locale, guildTags = true, providerId, test } = {}) => {
  const l = getLocale(locale);
  const { t } = l;

  const lootSum = event.lootValue ? event.lootValue.equipment + event.lootValue.inventory : null;

  const title = getEventTitle(event, t, { guildTags });

  let description;
  if (event.numberOfParticipants === 1) {
    description = t(`KILL.SOLO_${Math.floor(Math.random() * 6)}`);
  } else {
    const totalDamage = event.Participants.reduce((sum, participant) => {
      return sum + participant.DamageDone;
    }, 0);
    const assist = [];
    event.Participants.forEach((participant) => {
      // Self-damage isn't assist :P
      if (participant.Id === event.Victim.Id) {
        return;
      }
      const damagePercent = Math.round((participant.DamageDone / Math.max(1, totalDamage)) * 100);
      assist.push(`${participant.Name} (${damagePercent}%)`);
    });

    if (assist.length > 0) {
      description = t("KILL.ASSIST", { assists: assist.join(" / ") });
    }
  }

  let killerGuildValue;
  if (event.Killer.GuildName) {
    killerGuildValue = event.Killer.AllianceName ? `[${event.Killer.AllianceName}] ` : "";
    killerGuildValue += event.Killer.GuildName;
  }

  let victimGuildValue;
  if (event.Victim.GuildName) {
    victimGuildValue = event.Victim.AllianceName ? `[${event.Victim.AllianceName}] ` : "";
    victimGuildValue += event.Victim.GuildName;
  }

  const provider = REPORT_PROVIDERS.find((provider) => provider.id === providerId) || REPORT_PROVIDERS[0];
  const url =
    provider &&
    provider.events &&
    provider.events({
      id: event.EventId,
      server: event.server,
      lang: l.getLocale(),
    });

  return {
    content: test ? t("KILL.TEST") : undefined,
    embeds: [
      {
        color: getEventColor(event),
        title,
        url,
        description,
        thumbnail: {
          url: "https://user-images.githubusercontent.com/13356774/76129825-ee15b580-5fde-11ea-9f77-7ae16bd65368.png",
        },
        fields: [
          {
            name: t("KILL.FAME"),
            value: digitsFormatter(event.TotalVictimKillFame),
            inline: true,
          },
          {
            name: t("KILL.LOOT_VALUE"),
            value: digitsFormatter(lootSum) || "-",
            inline: true,
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: true,
          },
          {
            name: t("KILL.KILLER_GUILD"),
            value: killerGuildValue || t("KILL.NO_GUILD"),
            inline: true,
          },
          {
            name: t("KILL.VICTIM_GUILD"),
            value: victimGuildValue || t("KILL.NO_GUILD"),
            inline: true,
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: true,
          },
          {
            name: t("KILL.KILLER_IP"),
            value: `${Math.round(event.Killer.AverageItemPower)}`,
            inline: true,
          },
          {
            name: t("KILL.VICTIM_IP"),
            value: `${Math.round(event.Victim.AverageItemPower)}`,
            inline: true,
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: true,
          },
        ],
        timestamp: event.TimeStamp,
        footer,
      },
    ],
  };
};

const embedEventImage = (event, image, { locale, guildTags = true, addFooter, providerId, test }) => {
  const l = getLocale(locale);
  const { t } = l;

  const title = getEventTitle(event, t, { guildTags });
  const filename = `${event.EventId}-event.png`;

  const provider = REPORT_PROVIDERS.find((provider) => provider.id === providerId) || REPORT_PROVIDERS[0];
  const url =
    provider &&
    provider.events &&
    provider.events({
      id: event.EventId,
      server: event.server,
      lang: l.getLocale(),
    });

  return {
    content: test ? t("KILL.TEST") : undefined,
    embeds: [
      {
        color: getEventColor(event),
        title,
        url,
        image: {
          url: `attachment://${filename}`,
        },
        timestamp: addFooter ? moment(event.TimeStamp).toISOString() : undefined,
        footer: addFooter ? footer : undefined,
      },
    ],
    files: [
      {
        attachment: image,
        name: filename,
      },
    ],
  };
};

const embedEventInventoryImage = (event, image, { locale, providerId }) => {
  const l = getLocale(locale);

  const filename = `${event.EventId}-inventory.png`;

  const provider = REPORT_PROVIDERS.find((provider) => provider.id === providerId) || REPORT_PROVIDERS[0];
  const url =
    provider &&
    provider.events &&
    provider.events({
      id: event.EventId,
      server: event.server,
      lang: l.getLocale(),
    });

  return {
    embeds: [
      {
        color: getEventColor(event),
        url,
        image: {
          url: `attachment://${filename}`,
        },
        timestamp: moment(event.TimeStamp).toISOString(),
        footer,
      },
    ],
    files: [
      {
        attachment: image,
        name: filename,
      },
    ],
  };
};

const embedBattle = (battle, { locale, providerId, test }) => {
  const l = getLocale(locale);
  const { t } = l;

  const guildCount = Object.keys(battle.guilds || {}).length;

  const duration = moment
    .duration(moment(battle.endTime) - moment(battle.startTime))
    .locale(locale || "en")
    .humanize();
  const description = t("BATTLE.DESCRIPTION", {
    players: Object.keys(battle.players || {}).length,
    kills: battle.totalKills,
    fame: digitsFormatter(battle.totalFame),
    duration,
  });

  const line = (item) => {
    return t("BATTLE.LINE", {
      name: item.name,
      total: item.total,
      kills: item.kills,
      deaths: item.deaths,
      fame: digitsFormatter(item.killFame),
    });
  };

  const fields = [];
  const players = Object.keys(battle.players).map((id) => battle.players[id]);
  Object.keys(battle.alliances).forEach((id) => {
    const alliance = battle.alliances[id];
    alliance.total = players.reduce((sum, player) => sum + Number(player.allianceId === alliance.id), 0);
    const name = line(alliance);

    let value = "";
    Object.values(battle.guilds)
      .filter((guild) => guild.allianceId === id)
      .forEach((guild) => {
        guild.total = players.reduce((sum, player) => sum + Number(player.guildId === guild.id), 0);
        value += line(guild);
        value += "\n";
      });

    fields.push({
      name,
      value: value.substr(0, MAXLEN.FIELD.VALUE),
    });
  });

  const guildsWithoutAlliance = Object.values(battle.guilds).filter((guild) => !guild.allianceId);
  const playersWithoutGuild = Object.values(battle.players).filter((player) => !player.guildId);
  if (guildsWithoutAlliance.length > 0 || playersWithoutGuild.length > 0) {
    const name = t("BATTLE.NO_ALLIANCE");

    let value = "";
    guildsWithoutAlliance.forEach((guild) => {
      guild.total = players.reduce((sum, player) => sum + Number(player.guildId === guild.id), 0);
      value += line(guild);
      value += "\n";
    });

    if (playersWithoutGuild.length > 0) {
      const stats = {
        name: t("BATTLE.NO_GUILD"),
        total: 0,
        kills: 0,
        deaths: 0,
        killFame: 0,
      };
      playersWithoutGuild.forEach((player) => {
        stats.total += 1;
        stats.kills += player.kills;
        stats.deaths += player.deaths;
        stats.killFame += player.killFame;
      });
      value += line(stats);
      value += "\n";
    }

    fields.push({
      name,
      value: value.substr(0, MAXLEN.FIELD.VALUE),
    });
  }

  const provider = REPORT_PROVIDERS.find((provider) => provider.id === providerId) || REPORT_PROVIDERS[0];
  const url =
    provider &&
    provider.battles &&
    provider.battles({
      id: battle.id,
      server: battle.server,
      lang: l.getLocale(),
    });

  return {
    content: test ? t("BATTLE.TEST") : undefined,
    embeds: [
      {
        color: BATTLE,
        title: t("BATTLE.EVENT", { guilds: guildCount }),
        url,
        description,
        thumbnail: {
          url: "https://user-images.githubusercontent.com/13356774/76130049-b9eec480-5fdf-11ea-95c0-7de130a705a3.png",
        },
        fields: fields.slice(0, MAXLEN.FIELD.COUNT),
        timestamp: moment(battle.endTime).toISOString(),
        footer,
      },
    ],
  };
};

const embedTrackList = (track, limits, { locale }) => {
  const { t } = getLocale(locale);

  const printTrackList = (server, list, limit) => {
    if (!list || !Array.isArray(list)) return t("TRACK.NONE");

    list = list.filter((item) => item.server === server.id);
    if (list.length === 0) return t("TRACK.NONE");

    let value = "";

    list.forEach((item, i) => {
      if (i >= limit) value += `\n~~${item.name}~~`;
      else value += `\n${item.name}`;
    });

    return value;
  };

  return {
    embeds: [
      {
        color: COLORS.GREY,
        title: t("TRACK.PLAYERS.TITLE", { actual: track.players.length, max: limits.players }),
        fields: SERVER_LIST.map((server) => ({
          name: server.name,
          value: printTrackList(server, track.players, limits.players),
          inline: true,
        })),
      },
      {
        color: COLORS.LIGHT_GREEN,
        title: t("TRACK.GUILDS.TITLE", { actual: track.guilds.length, max: limits.guilds }),
        fields: SERVER_LIST.map((server) => ({
          name: server.name,
          value: printTrackList(server, track.guilds, limits.guilds),
          inline: true,
        })),
      },
      {
        color: COLORS.LIGHT_RED,
        title: t("TRACK.ALLIANCES.TITLE", { actual: track.alliances.length, max: limits.alliances }),
        fields: SERVER_LIST.map((server) => ({
          name: server.name,
          value: printTrackList(server, track.alliances, limits.alliances),
          inline: true,
        })),
      },
    ],
  };
};

const buildRankingTableLines = (ranking, scoreProperty) => {
  if (ranking.length === 0) {
    return [];
  }

  const lastRank = ranking.length;
  const rankWidth = Math.max(1, lastRank.toString().length);

  const tableRows = ranking.map((player, index) => ({
    rank: `${(index + 1).toString().padStart(rankWidth)}.`,
    name: (player.name || "?").replace(/\*\*/g, ""),
    score: humanFormatter(player.totalScore[scoreProperty], 2),
  }));

  return formatTableLines(
    [
      {
        accessor: "rank",
        width: rankWidth + 1,
        alignment: "right",
      },
      {
        accessor: "name",
        width: RANKING_NAME_COL_WIDTH,
        alignment: "left",
        truncate: RANKING_NAME_COL_WIDTH,
      },
      {
        accessor: "score",
        width: RANKING_SCORE_COL_WIDTH,
        alignment: "right",
      },
    ],
    tableRows,
  );
};

const formatRankingSection = (title, tableLines, emptyLabel) => {
  const table = tableLines.length > 0 ? wrapLinesInCodeBlock(tableLines) : emptyLabel;
  return `### ${title}\n\n${table}`;
};

const embedRanking = (rankings, { locale, test } = {}) => {
  const { t } = getLocale(locale);
  const emptyLabel = t("RANKING.NO_DATA_SHORT");

  const totalsBlock = wrapLinesInCodeBlock([
    `${t("RANKING.TOTAL_KILL_FAME")}: ${digitsFormatter(rankings.killFameTotal)}`,
    `${t("RANKING.TOTAL_DEATH_FAME")}: ${digitsFormatter(rankings.deathFameTotal)}`,
  ]);

  let content = formatPanelMessageContent({
    title: Markers.formatRankingLabel(rankings.type, t(`RANKING.${rankings.type.toUpperCase()}`)),
    body: [
      totalsBlock,
      formatRankingSection(
        t("RANKING.KILL_FAME"),
        buildRankingTableLines(rankings.killFameRanking, "killFame"),
        emptyLabel,
      ),
      formatRankingSection(
        t("RANKING.DEATH_FAME"),
        buildRankingTableLines(rankings.deathFameRanking, "deathFame"),
        emptyLabel,
      ),
    ].join("\n"),
    footer: Markers.buildFooter.ranking(rankings.type),
  });

  if (test) {
    content = truncateDiscordText(`${t("RANKING.TEST")}\n\n${content}`, DISCORD_MESSAGE_CONTENT_MAX);
  }

  return { content };
};

module.exports = {
  embedBattle,
  embedEvent,
  embedEventImage,
  embedEventInventoryImage,
  embedRanking,
  embedTrackList,
};
