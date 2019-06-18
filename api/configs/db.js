const mongoose = require('mongoose');
const config = require('./configs')();
const debug = require('debug')('api:server');

mongoose.connect(`mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.name}?authSource=admin`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  user: config.mongo.username,
  pass: config.mongo.password,
});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  // we're connected!
  debug(`Connected to DB: ${config.mongo.name}`);
});
module.exports = mongoose;
