'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserPostSchema = new Schema({
    GeneName: {type: String},
    Organism: {type: String},
    pmid: {type: Number},
    sentence: {type: String},
    useremail: {type: String}
  });
  return mongoose.model('UserPost', UserPostSchema);
};
