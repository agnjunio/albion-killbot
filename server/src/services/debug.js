const config = require("config");
const albion = require("../ports/albion");
const eventsService = require("./events");
const { getServerById, transformEvent } = require("../helpers/albion");

async function fetchPlayerKills({ playerId, server: serverId }) {
  const server = getServerById(serverId);
  if (!server) return null;

  const kills = (await albion.getPlayerKills(playerId, { server, silent: true })) || [];

  return {
    kills: kills.map(transformEvent),
  };
}

async function publishEvents({ eventIds = [], server: serverId }) {
  const server = getServerById(serverId);
  if (!server) return null;

  const uniqueEventIds = [...new Set(eventIds.map((eventId) => Number(eventId)).filter(Boolean))];
  if (uniqueEventIds.length === 0) return { published: 0, eventIds: [], failed: [] };

  const events = [];
  const failed = [];

  for (const eventId of uniqueEventIds) {
    const event = await eventsService.getEvent(eventId, { server });
    if (!event) {
      failed.push(eventId);
      continue;
    }

    event.server = server.id;
    events.push(event);
  }

  if (events.length === 0) {
    return { published: 0, eventIds: [], failed };
  }

  if (config.get("amqp.events.batch")) {
    await eventsService.publishEvent(events);
  } else {
    for (const event of events) {
      await eventsService.publishEvent(event);
    }
  }

  return {
    published: events.length,
    eventIds: events.map((event) => event.EventId),
    failed,
  };
}

module.exports = {
  fetchPlayerKills,
  publishEvents,
};
