export default {
  port: process.env.PORT || 8080,
  release: process.env.RELEASE,
  nodeEnv: process.env.NODE_ENV || "development",
  sentryDSN: process.env.SENTRY_DSN,
  cookieSecret: process.env.COOKIE_SECRET || "rig-rirjyhb-kfhbg4wd3dfjbg-yjgjhgwykgeuye4gt76r4gku",
  googleClientID: process.env.GOOGLE_CLIENT_ID || "",
  facebookClientID: process.env.FACEBOOK_APP_ID || "",
  gooogleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  facebookClientSecret: process.env.FACEBOOK_APP_SECRET || ""
};
