const config = require("config");
const logger = require("../../../helpers/logger");
const subscriptionsService = require("../../../services/subscriptions");
const serversService = require("../../../services/servers");

// TODO: Get this list from stripe
const SUPPORTED_CURRENCIES = ["usd", "brl"];

async function getSubscriptions(req, res) {
  try {
    const { user } = req.session.discord;
    const subscriptions = await subscriptionsService.fetchSubscriptionsByOwner(user.id);

    for (const subscription of subscriptions) {
      if (subscription.stripe)
        subscription.stripe = await subscriptionsService.getStripeSubscription(subscription.stripe);
      if (subscription.server) subscription.server = await serversService.getServer(subscription.server);
    }

    return res.send(subscriptions);
  } catch (error) {
    return res.sendStatus(403);
  }
}

async function getSubscriptionsPrices(req, res) {
  try {
    let { currency } = req.query;
    if (currency && SUPPORTED_CURRENCIES.indexOf(currency.toLowerCase()) === -1) {
      currency = "usd";
    }

    const prices = await subscriptionsService.fetchSubscriptionPrices(currency);
    const currencies = SUPPORTED_CURRENCIES;

    return res.send({ currencies, prices });
  } catch (error) {
    logger.error(error);
    return res.sendStatus(500);
  }
}

async function buySubscription(req, res) {
  try {
    const { priceId } = req.body;
    const { user } = req.session.discord;

    const checkout = await subscriptionsService.buySubscription(priceId, user.id);
    if (!checkout) return res.sendStatus(404);

    return res.send(checkout);
  } catch (error) {
    return res.sendStatus(500);
  }
}

async function assignSubscription(req, res) {
  const { subscriptionId } = req.params;
  const { server } = req.body;

  if (!subscriptionId) return res.sendStatus(422);

  try {
    const subscription = await subscriptionsService.getSubscriptionById(subscriptionId);
    if (!subscription) return res.sendStatus(404);

    const { user } = req.session.discord;
    if (subscription.owner !== user.id) return res.sendStatus(403);

    await subscriptionsService.unassignSubscriptionsByServerId(server);
    if (server) {
      await subscriptionsService.assignSubscription(subscription.id, server);
      subscription.server = server;
    }

    return res.send(subscription);
  } catch (error) {
    logger.error(`Error while assigning subscription: `, error);
    return res.sendStatus(500);
  }
}

async function manageSubscription(req, res) {
  const { subscriptionId } = req.params;

  if (!subscriptionId) return res.sendStatus(422);

  try {
    const subscription = await subscriptionsService.getSubscriptionById(subscriptionId);
    if (!subscription || !subscription.stripe) return res.sendStatus(404);

    let customerId = req.body.customerId;
    if (!customerId) {
      const stripeSubscription = await subscriptionsService.getStripeSubscription(subscription.stripe);
      if (!stripeSubscription) return res.sendStatus(404);
      customerId = stripeSubscription.customer;
    }

    const session = await subscriptionsService.manageSubscription(customerId);
    if (!session) return res.sendStatus(404);

    return res.send(session);
  } catch (error) {
    return res.sendStatus(500);
  }
}

subscriptionsService.subscriptionEvents.on("add", (subscription) => {
  if (config.has("discord.community.server") && config.has("discord.community.premiumRole") && subscription.owner) {
    serversService.addMemberRole(
      config.get("discord.community.server"),
      subscription.owner,
      config.get("discord.community.premiumRole"),
      "Add Premium User role",
    );
  }
});

subscriptionsService.subscriptionEvents.on("remove", (subscription) => {
  if (config.has("discord.community.server") && config.has("discord.community.premiumRole") && subscription.owner) {
    serversService.removeMemberRole(
      config.get("discord.community.server"),
      subscription.owner,
      config.get("discord.community.premiumRole"),
      "Remove Premium User role",
    );
  }
});

module.exports = {
  assignSubscription,
  buySubscription,
  getSubscriptions,
  getSubscriptionsPrices,
  manageSubscription,
};
