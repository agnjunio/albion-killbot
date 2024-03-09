const moment = require("moment");
const { REPORT_PROVIDERS } = require("./constants");
const { getLocale } = require("./locale");
const { digitsFormatter, humanFormatter, printSpace } = require("./utils");
const { SERVER_LIST } = require("./albion");

const BATTLE = 16752981;
const RANKING_LINE_LENGTH = 23;

const COLORS = {
  LIGHT_GREEN: 0x57ad65,
  LIGHT_RED: 0xed4f4f,

  DARK_GREEN: 52224,

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

const footer = {
  text: "Powered by Albion Killbot",
};

const embedEvent = (event, { lootValue, locale, guildTags = true, providerId, test } = {}) => {
  const l = getLocale(locale);
  const { t } = l;

  const { good, juicy } = event;
  const lootSum = lootValue ? lootValue.equipment + lootValue.inventory : null;

  let killer = "";
  if (guildTags && event.Killer.GuildName) {
    killer += `[${event.Killer.GuildName}] `;
  }
  killer += event.Killer.Name;

  let victim = "";
  if (juicy) victim += ":moneybag: ";
  if (guildTags && event.Victim.GuildName) {
    victim += `[${event.Victim.GuildName}] `;
  }
  victim += event.Victim.Name;
  if (juicy) victim += " :moneybag:";

  const title = t(good ? "KILL.GOOD_TITLE" : "KILL.BAD_TITLE", {
    killer,
    victim,
  });

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
      if (participant.Name === event.Victim.Name) {
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
        color: juicy ? COLORS.GOLD : good ? COLORS.DARK_GREEN : COLORS.RED,
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

  const { good, juicy } = event;

  let killer = "";
  if (guildTags && event.Killer.GuildName) {
    killer += `[${event.Killer.GuildName}] `;
  }
  killer += event.Killer.Name;

  let victim = "";
  if (juicy) victim += ":moneybag: ";
  if (guildTags && event.Victim.GuildName) {
    victim += `[${event.Victim.GuildName}] `;
  }
  victim += event.Victim.Name;
  if (juicy) victim += " :moneybag:";

  const title = t(good ? "KILL.GOOD_TITLE" : "KILL.BAD_TITLE", {
    killer,
    victim,
  });
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
        color: juicy ? COLORS.GOLD : good ? COLORS.DARK_GREEN : COLORS.RED,
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
  const { good, juicy } = event;

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
        color: juicy ? COLORS.GOLD : good ? COLORS.DARK_GREEN : COLORS.RED,
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

const embedRanking = (rankings, { locale, test } = {}) => {
  const { t } = getLocale(locale);

  const generateRankFieldValue = (ranking, scoreProperty) => {
    let value = "```c";
    if (ranking.length === 0) {
      const nodata = t("RANKING.NO_DATA_SHORT");
      const count = RANKING_LINE_LENGTH - nodata.length;
      value += `\n${nodata}${printSpace(count)}`;
    }
    ranking.forEach((player) => {
      const nameValue = player.name;
      const numberValue = humanFormatter(player.totalScore[scoreProperty], 2);
      const count = RANKING_LINE_LENGTH - numberValue.length - nameValue.length;
      value += `\n${nameValue}${printSpace(count)}${numberValue}`;
    });
    value += "```";
    return value;
  };

  const icons = {
    daily: "https://i.imgur.com/2qoyHQm.png",
    weekly: "https://i.imgur.com/1F5mrVw.png",
    monthly: "https://i.imgur.com/Qiwaxp3.png",
    alltime: "https://i.imgur.com/sDx8gRq.png",
  };

  const colors = {
    daily: COLORS.GREEN,
    weekly: COLORS.BLUE,
    monthly: COLORS.PURPLE,
    alltime: COLORS.YELLOW,
  };

  return {
    content: test ? t("RANKING.TEST") : undefined,
    embeds: [
      {
        title: t(`RANKING.${rankings.type.toUpperCase()}`),
        color: colors[rankings.type],
        thumbnail: {
          url: icons[rankings.type],
        },
        fields: [
          {
            name: t("RANKING.TOTAL_KILL_FAME"),
            value: digitsFormatter(rankings.killFameTotal),
            inline: true,
          },
          {
            name: t("RANKING.TOTAL_DEATH_FAME"),
            value: digitsFormatter(rankings.deathFameTotal),
            inline: true,
          },
          {
            name: "\u200B",
            value: "\u200B",
            inline: false,
          },
          {
            name: t("RANKING.KILL_FAME"),
            value: generateRankFieldValue(rankings.killFameRanking, "killFame"),
            inline: true,
          },
          {
            name: t("RANKING.DEATH_FAME"),
            value: generateRankFieldValue(rankings.deathFameRanking, "deathFame"),
            inline: true,
          },
        ],
        footer,
      },
    ],
  };
};

module.exports = {
  embedBattle,
  embedEvent,
  embedEventImage,
  embedEventInventoryImage,
  embedRanking,
  embedTrackList,
};
