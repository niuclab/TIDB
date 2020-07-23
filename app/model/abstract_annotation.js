'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AbstractAnnotationSchema = new Schema({
    searchKey: {
      type: String,
      index: true
    }
  }, {
    strict: false
  });
  return mongoose.model('AbstractAnnotation', AbstractAnnotationSchema, 'abstract_annotation');
};
