const ApiClient = require('./_testUtils/client.js');
const db = require('./_testUtils/db');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

global.client = new ApiClient();

beforeAll(async done => {
  db.init(done);
});

afterAll(async done => {
  await db.clear();
  done();
});
