const { find, findOne, updateOne, deleteOne } = require("../ports/database");

const { memoize, set, remove } = require("../helpers/cache");
const { REPORT_MODES, MINUTE } = require("../helpers/constants");
const { clone, mergeObjects } = require("../helpers/utils");

const SETTINGS_COLLECTION = "settings";

const DEFAULT_SETTINGS = Object.freeze({
  general: {
    locale: "en",
    showAttunement: true,
    guildTags: false,
    splitLootValue: false,
    combinedEventImage: true,
  },
  kills: {
    enabled: true,
    channel: null,
    mode: REPORT_MODES.IMAGE,
  },
  deaths: {
    enabled: true,
    channel: null,
    mode: REPORT_MODES.IMAGE,
  },
  assists: {
    enabled: false,
    channel: null,
    mode: REPORT_MODES.IMAGE,
  },
  depths: {
    enabled: false,
    channel: null,
    mode: REPORT_MODES.IMAGE,
  },
  juicy: {
    enabled: {},
    mode: REPORT_MODES.IMAGE,
    good: {
      channel: null,
    },
    insane: {
      channel: null,
    },
  },
  battles: {
    enabled: true,
    channel: null,
    threshold: {
      players: 0,
      guilds: 0,
      alliances: 0,
    },
  },
  rankings: {
    enabled: true,
    channel: null,
    daily: "off",
    weekly: "off",
    monthly: "off",
  },
});

// A stored category can be null (e.g. an older client PUT a settings object missing a
// newly added category, which Mongo persists as null instead of just omitting the key).
// mergeObjects only fills in defaults for missing keys, not null ones, so drop those here
// first to fall back to DEFAULT_SETTINGS instead of crashing on a null category downstream.
const generateSettings = (settings) => {
  const sanitizedSettings = { ...settings };
  for (const category of Object.keys(DEFAULT_SETTINGS)) {
    if (sanitizedSettings[category] === null) delete sanitizedSettings[category];
  }
  return mergeObjects(clone(DEFAULT_SETTINGS), sanitizedSettings);
};

async function getSettings(serverId) {
  return await memoize(
    `settings-${serverId}`,
    async () => {
      const settings = await findOne(SETTINGS_COLLECTION, { server: serverId });
      return generateSettings(settings);
    },
    {
      timeout: MINUTE,
    },
  );
}

async function fetchAllSettings() {
  return await find(SETTINGS_COLLECTION, {});
}

async function setSettings(serverId, data) {
  // TODO: Schema validation
  const { general, kills, deaths, assists, depths, juicy, battles, rankings } = data;

  // Mongo persists $set fields that are undefined (e.g. a client missing a newly added
  // category) as null instead of leaving them out, corrupting the stored document for
  // every future read. Drop undefined categories here so we never write that in the first
  // place; generateSettings() still heals any documents already affected by this.
  const update = { server: serverId, general, kills, deaths, assists, depths, juicy, battles, rankings };
  for (const key of Object.keys(update)) {
    if (update[key] === undefined) delete update[key];
  }

  await updateOne(SETTINGS_COLLECTION, { server: serverId }, { $set: update }, { upsert: true });
  remove(`settings-${serverId}`);
  return await getSettings(serverId);
}

async function deleteSettings(serverId) {
  return await deleteOne(SETTINGS_COLLECTION, { server: serverId });
}

async function updateSettingsCache(serverIds, { timeout, debug } = {}) {
  const settings = await find(SETTINGS_COLLECTION, {});

  serverIds.forEach((serverId) => {
    const setting = settings.find((setting) => setting.server === serverId);
    set(`settings-${serverId}`, generateSettings(setting), { timeout, debug });
  });
}

async function hasServerSettings(serverIds = []) {
  const servers = await find(SETTINGS_COLLECTION, { server: { $in: serverIds } });
  const hasServerSettings = {};
  for (const serverId of serverIds) {
    hasServerSettings[serverId] = servers.some((server) => server.server === serverId);
  }
  return hasServerSettings;
}

module.exports = {
  REPORT_MODES,
  deleteSettings,
  fetchAllSettings,
  getSettings,
  setSettings,
  hasServerSettings,
  updateSettingsCache,
};
