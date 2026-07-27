const ITEM_POWER_TABLE = require("../../assets/albion/itemPower.json");

// Quality bonus applied on top of an item's base+enchant power (Quality 1-5 -> normal..masterpiece).
const QUALITY_BONUS = { 1: 0, 2: 20, 3: 40, 4: 60, 5: 100 };
const EQUIPMENT_SLOTS = ["MainHand", "OffHand", "Head", "Armor", "Shoes", "Cape"];

// The gap between a player's reported AverageItemPower and the sum of their gear's
// base+enchant+quality power below the soft-cap threshold (where no compression can be
// happening). It's assumed to come from mastery/specialization bonuses, which aren't
// derivable from event data, so it's applied as a flat correction. Derived empirically
// from ~500 real events with AverageItemPower < 1200 (median of raw - reported).
const MASTERY_BONUS_OFFSET = 157.8;

function parseItemPower(item) {
  if (!item || !item.Type) return null;

  const match = item.Type.match(/^(T\d_[A-Z0-9_]+?)(?:@(\d))?$/);
  if (!match) return null;

  const [, baseId, enchant] = match;
  const basePower = ITEM_POWER_TABLE[baseId];
  if (basePower === undefined) return null;

  const qualityBonus = QUALITY_BONUS[item.Quality] ?? 0;
  return basePower + Number(enchant || 0) * 100 + qualityBonus;
}

// Computes the "raw" (uncompressed) average item power for a set of equipment, mirroring
// the game's own AverageItemPower calc: averaged over 6 gear slots, with a two-handed
// weapon's power counted for both MainHand and OffHand.
function computeRawItemPower(equipment) {
  if (!equipment) return null;

  const mainHand = equipment.MainHand;
  const isTwoHanded = !!mainHand?.Type?.includes("2H");

  let total = 0;
  for (const slot of EQUIPMENT_SLOTS) {
    const item = slot === "OffHand" && !equipment.OffHand && isTwoHanded ? mainHand : equipment[slot];
    const power = parseItemPower(item);
    if (power === null) continue;
    total += power;
  }

  return total / EQUIPMENT_SLOTS.length + MASTERY_BONUS_OFFSET;
}

function isPlayerSoftCapped(player, softcap, threshold, tolerance, minGap) {
  if (!player || typeof player.AverageItemPower !== "number") return false;

  const rawPower = computeRawItemPower(player.Equipment);
  if (rawPower === null || rawPower <= softcap) return false;

  // Near the cap, the compression curve is close to the identity line, so any
  // uncompressed player would also match it within tolerance. Requiring a minimum
  // absolute gap between raw and reported power filters out that dead zone.
  if (rawPower - player.AverageItemPower < minGap) return false;

  const expectedPower = softcap + (rawPower - softcap) * threshold;
  return Math.abs(player.AverageItemPower - expectedPower) <= tolerance;
}

// Checks whether an event's item power looks compressed by a soft-cap curve:
//   effectivePower = softcap + max(0, rawPower - softcap) * threshold
// Used to detect low-risk zones (e.g. Depths) where high-IP gear gets scaled down for
// AverageItemPower reporting purposes. Checks both the killer and the victim, since
// either side can be the one wearing gear above the cap.
//
// softcap: item power above which compression kicks in (e.g. 1200)
// threshold: fraction of power above the cap that still counts (e.g. 0.2 for 20%)
// tolerance: allowed IP deviation from the predicted curve, to absorb estimation noise
// minGap: minimum raw-vs-reported IP gap required before treating it as compression,
//   to rule out uncompressed players just above the cap (see isPlayerSoftCapped)
function isEventSoftCapped(event, softcap, threshold, tolerance = 50, minGap = 100) {
  if (!event) return false;
  return (
    isPlayerSoftCapped(event.Killer, softcap, threshold, tolerance, minGap) ||
    isPlayerSoftCapped(event.Victim, softcap, threshold, tolerance, minGap)
  );
}

module.exports = {
  computeRawItemPower,
  isEventSoftCapped,
};
