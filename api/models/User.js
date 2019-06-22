const db = require('../configs/db');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const userSchema = new db.Schema({
  firstName: 'string',
  lastName: 'string',
  email: { type: String, unique: true, lowercase: true, trim: true },
  city: 'string',
  country: 'string',
  password: 'string',
  type: 'string',
  categories: [{ type: String, lowercase: true, trim: true }],
  subCategories: [{ type: String, lowercase: true, trim: true }],
});
userSchema.path('email').index({ unique: true });

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toClient = function() {
  return _(this)
    .pick(['id', 'email', 'firstName', 'lastName', 'city', 'country', 'categories', 'subCategories'])
    .defaults({ categories: [], subCategories: [] });
};
const User = db.model('User', userSchema);

module.exports = User;
