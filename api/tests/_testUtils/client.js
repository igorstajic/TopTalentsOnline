const supertest = require('supertest'); // eslint-disable-line
const app = require('../../app');

class ApiClient {
  setToken(token) {
    this.token = token;
  }

  async get(path, qs) {
    const result = await supertest(app)
      .get(path)
      .set('authorization', `Bearer ${this.token || ''}`)
      .query(qs);

    if (result.error) {
      logger.error(JSON.stringify(result.body));
    }
    if (qs) {
      logger.info('---REQUEST.BODY---');
      logger.info(JSON.stringify(qs, null, 2));
    }
    logger.info('---RESPONSE.BODY---');
    logger.info(JSON.stringify(result.body, null, 2));
    return result;
  }

  async post(path, body) {
    const result = await supertest(app)
      .post(path)
      .set('authorization', `Bearer ${this.token || ''}`)
      .send(body);

    if (result.error) {
      logger.error(JSON.stringify(result.body));
    }
    logger.info('---REQUEST.BODY---');
    logger.info(JSON.stringify(body, null, 2));
    logger.info('---RESPONSE.BODY---');
    logger.info(JSON.stringify(result.body, null, 2));
    return result;
  }

  async put(path, body) {
    const result = await supertest(app)
      .put(path)
      .set('authorization', `Bearer ${this.token || ''}`)
      .send(body);

    if (result.error) {
      logger.error(JSON.stringify(result.body));
    }
    logger.info('---REQUEST.BODY---');
    logger.info(JSON.stringify(body, null, 2));
    logger.info('---RESPONSE.BODY---');
    logger.info(JSON.stringify(result.body, null, 2));
    return result;
  }

  async delete(path, body = {}) {
    const result = await supertest(app)
      .delete(path)
      .set('authorization', `Bearer ${this.token || ''}`)
      .send(body);

    if (result.error) {
      logger.error(JSON.stringify(result.body));
    }
    logger.info('---REQUEST.BODY---');
    logger.info(JSON.stringify(body, null, 2));
    logger.info('---RESPONSE.BODY---');
    logger.info(JSON.stringify(result.body, null, 2));
    return result;
  }
}

module.exports = ApiClient;
