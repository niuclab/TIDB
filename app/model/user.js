'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    email: {type: String, index: true},
    password: {
      type: String
    }
  });
  return mongoose.model('User', UserSchema);
};
