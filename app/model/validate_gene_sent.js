'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ValidateGeneSentSchema = new Schema({
    gene_sent_id: Schema.Types.ObjectId,
    email: {type: String},
    result: {type: String},
  }, {
      strict:false
  });
  return mongoose.model('ValidateGeneSent', ValidateGeneSentSchema, "validate_gene_sent");
};
