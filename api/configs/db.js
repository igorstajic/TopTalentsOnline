const mongoose = require('mongoose');
const config = require('./configs')();
const debug = require('debug')('api:server');

mongoose
  .connect(`mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.name}?authSource=admin`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    user: config.mongo.username,
    pass: config.mongo.password,
  })
  .catch(() => {
    debug(`Error connecting to DB`);
  });

const connection = mongoose.connection;

connection.on('error', function(error) {
  debug(`DB connection error.`);
  console.error(error); //eslint-disable-line
});
connection.once('open', function() {
  debug(`Connected to DB: ${config.mongo.name}`);
});

module.exports = mongoose;
