const { SERVER_LIST } = require("../../../helpers/albion");
const { REPORT_PROVIDERS, REPORT_MODES, SUBSCRIPTION_STATUS, RANKING_MODES } = require("../../../helpers/constants");
const { getLocale } = require("../../../helpers/locale");

const router = require("express").Router();

/**
 * @openapi
 * /constants:
 *   get:
 *     tags: [Constants]
 *     summary: Return server constants
 *     operationId: getConstants
 *     responses:
 *       200:
 *         description: Server constants
 *       401:
 *         description: Unable to authenticate
 */
router.get(`/`, (req, res) => {
  return res.send({
    languages: getLocale().getLocales(),
    modes: Object.values(REPORT_MODES),
    providers: REPORT_PROVIDERS.map(({ id, name, events, battles }) => ({
      id,
      name,
      events: !!events,
      battles: !!battles,
    })),
    rankingModes: RANKING_MODES,
    servers: SERVER_LIST,
    subscriptionStatuses: Object.values(SUBSCRIPTION_STATUS),
  });
});

module.exports = {
  path: "/constants",
  router,
};
