const mongoose = require('mongoose');
const config = require('./configs')();

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(`mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.name}?authSource=admin`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      user: config.mongo.username,
      pass: config.mongo.password,
    })
    .catch(() => {
      logger.error(`Error connecting to DB`);
    });

  const connection = mongoose.connection;

  connection.on('error', function(error) {
    logger.error(`DB connection error.`);
    logger.error(error);
  });
  connection.once('open', function() {
    logger.debug(`Connected to DB: ${config.mongo.name}`);
  });
}

module.exports = mongoose;
