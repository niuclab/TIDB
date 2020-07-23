'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TidbGeneSchema = new Schema({
    pmid: {type: String, index: true},
    sentence_position: {
      type: Number
    },
    gene_name: {
      type: String,
      index: true
    },
  }, {
    strict: false
  });
  return mongoose.model('TidbGene', TidbGeneSchema, 'tidb_gene');
};
