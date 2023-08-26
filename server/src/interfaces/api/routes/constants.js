const { REPORT_PROVIDERS, REPORT_MODES, SERVER_LIST, SUBSCRIPTION_STATUS } = require("../../../helpers/constants");

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
    modes: Object.values(REPORT_MODES),
    providers: REPORT_PROVIDERS.map(({ id, name, events, battles }) => ({
      id,
      name,
      events: !!events,
      battles: !!battles,
    })),
    servers: SERVER_LIST,
    subscriptionStatuses: SUBSCRIPTION_STATUS,
  });
});

module.exports = {
  path: "/constants",
  router,
};
