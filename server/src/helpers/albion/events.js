// Get all victim items, including equipment and inventory, excluding nulls
function getVictimItems(event) {
  const { Equipment, Inventory } = event.Victim;
  return {
    equipment: [
      Equipment.Armor,
      Equipment.Bag,
      Equipment.Cape,
      Equipment.Food,
      Equipment.Head,
      Equipment.MainHand,
      Equipment.Mount,
      Equipment.OffHand,
      Equipment.Potion,
      Equipment.Shoes,
    ].filter((item) => !!item),
    inventory: Inventory.filter((item) => !!item),
  };
}

const transformEventPlayer = (player) => ({
  id: player.Id,
  name: player.Name,
  ip: player.AverageItemPower,
  killFame: player.KillFame,
  deathFame: player.DeathFame,
  guild: player.GuildId
    ? {
        id: player.GuildId,
        name: player.GuildName,
      }
    : null,
  alliance: player.AllianceId
    ? {
        id: player.AllianceId,
        tag: player.AllianceTag,
        name: player.AllianceName,
      }
    : null,
  equipment: player.Equipment,
});

const transformEvent = (event) => ({
  id: event.EventId,
  server: event.server,
  battle: event.BattleId,
  timestamp: event.TimeStamp,
  fame: event.TotalVictimKillFame,
  killer: transformEventPlayer(event.Killer),
  victim: transformEventPlayer(event.Victim),
  participants: event.Participants.map(transformEventPlayer),
  lootValue: event.lootValue,
});

const hasAwakening = (event) => {
  return event.Killer?.Equipment?.MainHand?.LegendarySoul || event.Victim?.Equipment?.MainHand?.LegendarySoul;
};

module.exports = {
  getVictimItems,
  transformEvent,
  hasAwakening,
};
