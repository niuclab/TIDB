'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const GeneInfoSchema = new Schema({
    gene_anno_table: {type: String},
    gene_symbol: {
      type: String,
      index: true
    }}, {
    strict: false
  });
  return mongoose.model('GeneInfo', GeneInfoSchema, 'gene_info');
};
