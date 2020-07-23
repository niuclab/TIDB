'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const GeneAnnotationSchema = new Schema({
    searchKey: {
      type: String,
      index: true
    }
  }, {
    strict: false
  });
  return mongoose.model('GeneAnnotation', GeneAnnotationSchema, 'gene_annotation');
};
