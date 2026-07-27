const servers = require("./servers");
const entities = require("./entities");
const events = require("./events");
const traits = require("./traits");
const itemPower = require("./itemPower");
const depths = require("./depths");

module.exports = {
  ...servers,
  ...entities,
  ...events,
  ...traits,
  ...itemPower,
  ...depths,
};
