const db = require('../configs/db');

const messageSchema = new db.Schema({
  uid: { type: db.Schema.Types.ObjectId, ref: 'User' },
  from: 'string',
  message: 'string',
  contactName: 'string',
  isRead: { type: Boolean, default: false },
});

const Message = db.model('Message', messageSchema);

module.exports = Message;
