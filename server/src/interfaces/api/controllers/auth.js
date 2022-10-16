const moment = require("moment");
const logger = require("../../../helpers/logger");
const authService = require("../../../services/auth");

const { SESSION_COOKIE_NAME = "albion-killbot" } = process.env;

async function auth(req, res) {
  try {
    const { code } = req.body;

    const token = await authService.auth(code);

    req.session.discord = {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expires: moment().add(token.expires_in, "seconds"),
    };

    return res.sendStatus(200);
  } catch (error) {
    logger.error(`Unable to authenticate with discord:`, error);
    return res.sendStatus(403);
  }
}

async function logout(req, res) {
  delete req.session.discord;
  res.clearCookie(SESSION_COOKIE_NAME);
  return res.sendStatus(200);
}

module.exports = {
  auth,
  logout,
};
