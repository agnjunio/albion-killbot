const { isEventSoftCapped } = require("./itemPower");

// Depths gear is soft-capped at 1200 item power, with only 20% of power above that
// threshold counting toward the reported AverageItemPower.
const DEPTHS_SOFTCAP = 1200;
const DEPTHS_SOFTCAP_RATE = 0.2;

// Depths parties are always duo or trio; solo "kills" there are typically farming/practice
// and are excluded rather than treated as a signal either way.
const DEPTHS_GROUP_SIZES = [2, 3];

// Flags kills that plausibly happened in Depths: a duo/trio party where the killer or
// victim's reported item power shows the softcap-compression signature.
function isDepthsKill(event) {
  if (!event) return false;
  if (!DEPTHS_GROUP_SIZES.includes(event.groupMemberCount)) return false;

  return isEventSoftCapped(event, DEPTHS_SOFTCAP, DEPTHS_SOFTCAP_RATE);
}

module.exports = {
  isDepthsKill,
};
