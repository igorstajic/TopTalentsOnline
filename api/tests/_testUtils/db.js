const jwt = require('jsonwebtoken');

const config = require('../../configs/configs')();
const mongoose = require('../../configs/db');

const User = require('../../models/User');

global.fixtures = {
  users: [],
};

const initUsers = async () => {
  // Users
  let regularUser = new User({
    _id: '189b5b4aa79dff2f7fe6659d',
    email: 'regular@test.com',
    password: 'password',
    firstName: 'regular_user_name',
    lastName: 'regular_user_lastname',
    type: 'regular',
  });
  let adminUser = new User({
    _id: '289b5b4aa79dff2f7fe6759d',
    email: 'admin@test.com',
    password: 'password',
    firstName: 'admin_user_name',
    lastName: 'admin_user_lastname',
    type: 'admin',
  });

  regularUser = await regularUser.save();
  adminUser = await adminUser.save();

  regularUser.token = jwt.sign({ uid: regularUser.id }, config.keys.tokenKey, { expiresIn: config.keys.tokenExpiresIn });
  adminUser.token = jwt.sign({ uid: adminUser.id }, config.keys.tokenKey, { expiresIn: config.keys.tokenExpiresIn });

  fixtures.users.push(regularUser);
  fixtures.users.push(adminUser);
};

const init = done => {
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

  connection.once('open', async function() {
    logger.debug(`Connected to DB: ${config.mongo.name}`);
    await initUsers();
    done();
  });
};

const clear = async () => {
  await User.deleteMany({});
};

module.exports = {
  init,
  clear,
};
