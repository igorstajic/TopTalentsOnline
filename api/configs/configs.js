module.exports = () => ({
  app: {
    name: process.env.APP_NAME,
    port: process.env.APP_PORT || 8000,
  },
  mongo: {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    username: process.env.DB_ADMINUSERNAME,
    password: process.env.DB_ADMINPASSWORD,
  },
  keys: {
    tokenKey: process.env.TOKEN_KEY,
    tokenExpiresIn: process.env.TOKEN_EXPIRES_IN
  },
  logs: {
    level: process.env.LOG_LEVEL
  }
});
