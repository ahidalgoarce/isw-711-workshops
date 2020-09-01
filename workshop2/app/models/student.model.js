'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    createIndexes: { unique: true },
  },
  address: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('Student', StudentSchema);
module.exports = User;