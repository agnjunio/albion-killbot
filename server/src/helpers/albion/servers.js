// This stores the information about servers used in the entire application
const SERVERS = {
  AMERICAS: {
    id: "americas",
    name: "Albion Americas",
    liveId: "live_us",
  },
  ASIA: {
    id: "asia",
    name: "Albion Asia",
    liveId: "live_sgp",
  },
  EUROPE: {
    id: "europe",
    name: "Albion Europe",
    liveId: "live_ams",
  },
};
const SERVER_DEFAULT = SERVERS.AMERICAS;
// This is an ordered list we'd like to display
const SERVER_LIST = [SERVERS.AMERICAS, SERVERS.ASIA, SERVERS.EUROPE];

const getServerById = (serverId) => Object.values(SERVERS).find((server) => server.id === serverId);

module.exports = {
  SERVERS,
  SERVER_DEFAULT,
  SERVER_LIST,
  getServerById,
};
