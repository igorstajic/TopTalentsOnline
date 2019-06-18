const db = require('../configs/db');
const bcrypt = require('bcrypt');

const userSchema = new db.Schema({
  firstName: 'string',
  lastName: 'string',
  email: { type: String, unique: true },
  city: 'string',
  country: 'string',
  password: 'string',
  type: 'string',
});
userSchema.path('email').index({ unique: true });

userSchema.pre(
  'save',
  async function(next) {
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  },
  function(err) {
    next(err);
  }
);

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = db.model('User', userSchema);

module.exports = User;
