const { createCanvas } = require("canvas");
const { hasAwakening } = require("../../../helpers/albion");
const { optimizeImage } = require("../../../helpers/images");
const { fileSizeFormatter } = require("../../../helpers/utils");
const logger = require("../../../helpers/logger");
const { memoize } = require("../../../helpers/cache");
const { SECOND } = require("../../../helpers/constants");
const { drawEventBackground } = require("../draw/background");
const { drawPlayer } = require("../draw/player");
const { drawTimestamp, drawFame, drawLootValue, drawAssistCount } = require("../draw/stats");
const {
  drawParticipantBars,
  getParticipantBarsBottom,
  PARTICIPANT_BARS_BOTTOM_PADDING,
} = require("../draw/participantBars");
const { getInventorySectionHeight, drawInventorySection } = require("../draw/inventory");

const CANVAS_WIDTH = 1600;
const BASE_HEIGHT = 1250;
const ATTUNEMENT_HEIGHT = 250;
const PARTICIPANT_BARS_Y = 1100;

async function generateEventImage(
  event,
  { showAttunement = true, splitLootValue = false, includeInventory = false } = {},
) {
  const cacheKey = includeInventory ? `eventImage-${event.EventId}-combined` : `eventImage-${event.EventId}`;

  return memoize(
    cacheKey,
    async () => {
      showAttunement = showAttunement && hasAwakening(event);
      const attunementHeight = showAttunement ? ATTUNEMENT_HEIGHT : 0;
      const barsY = PARTICIPANT_BARS_Y + attunementHeight;
      const barsBottom = getParticipantBarsBottom(event.Participants, barsY);
      const eventHeight = Math.max(BASE_HEIGHT + attunementHeight, barsBottom + PARTICIPANT_BARS_BOTTOM_PADDING);

      const inventory = includeInventory ? event.Victim.Inventory.filter((i) => i != null) : [];
      const inventoryHeight = getInventorySectionHeight(inventory, { splitLootValue, lootValue: event.lootValue });
      const canvasHeight = eventHeight + inventoryHeight;

      let canvas = createCanvas(CANVAS_WIDTH, canvasHeight);
      const w = canvas.width;
      const ctx = canvas.getContext("2d");

      await drawEventBackground(ctx, CANVAS_WIDTH, canvasHeight);
      await drawPlayer(ctx, event.Killer, 15, 0, { showAttunement });
      await drawPlayer(ctx, event.Victim, 935, 0, { showAttunement });
      await drawTimestamp(ctx, event, w / 2, 50);
      const assistCount = Math.max(event.GroupMembers.length, event.Participants.length);
      if (assistCount > 1) await drawAssistCount(ctx, assistCount, w / 2, 290, { iconSize: 80 });
      await drawFame(ctx, event, w / 2, 470);
      if (event.lootValue) await drawLootValue(ctx, event.lootValue, w / 2, 675, { splitLootValue });

      await drawParticipantBars(ctx, event.Participants, w, barsY);

      if (inventory.length) {
        await drawInventorySection(ctx, inventory, eventHeight, { splitLootValue, lootValue: event.lootValue });
      }

      const buffer = await optimizeImage(canvas.toBuffer(), 580);
      canvas = null;

      if (buffer.length > 2 * 1048576) {
        logger.warn(`Event image bigger than usual. Size: ${fileSizeFormatter(buffer.length)}`);
      }
      return buffer;
    },
    {
      timeout: 60 * SECOND,
    },
  );
}

module.exports = {
  generateEventImage,
};
