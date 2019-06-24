const db = require('../configs/db');
const _ = require('lodash');

const messageSchema = new db.Schema({
  uid: { type: db.Schema.Types.ObjectId, ref: 'User' },
  from: 'string',
  message: 'string',
  contactName: 'string',
  timestamp: 'number',
  isRead: { type: Boolean, default: false },
});

messageSchema.methods.toClient = function() {
  return _(this).pick(['id', 'from', 'contactName', 'message', 'timestamp']);
};

const Message = db.model('Message', messageSchema);

module.exports = Message;
