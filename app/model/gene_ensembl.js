'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const GeneEnsemblSchema = new Schema({
    ensembl: {type: String},
    gene_symbol: {
      type: String,
      index: true
    },
    create_at: {
      type: Date,
      default: Date.now,
      index: true
    },
    update_at: {
      type: Date,
      default: Date.now,
      index: true
    },
  }, {
    strict: false
  });
  return mongoose.model('GeneEnsembl', GeneEnsemblSchema, 'gene_ensembl');
};
