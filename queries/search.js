const axios = require("axios");
const logger = require("../logger")("queries.search");

const SEARCH_ENDPOINT = "https://gameinfo.albiononline.com/api/gameinfo/search";

exports.search = async q => {
  try {
    logger.debug(`Searching entities in Albion Online for: ${q}`);
    // Manual timeout is necessary because network timeout isn't triggered by axios
    const source = axios.CancelToken.source();
    setTimeout(() => {
      source.cancel();
    }, 60000);
    const res = await axios.get(SEARCH_ENDPOINT, {
      cancelToken: source.token,
      params: { q },
    });
    return res.data;
  } catch (e) {
    logger.error(`Failed to search entities in API: ${e}`);
    return {
      players: [],
      guilds: [],
      alliances: [],
    };
  }
};
