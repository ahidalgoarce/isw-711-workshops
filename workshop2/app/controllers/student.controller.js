const createError = require('http-errors');
const mongoose = require('mongoose');

const Student = require('../models/student.model');

module.exports = {

  getAllStudents: async (req, res, next) => {
    try {
      const results = await Student.find({}, { __v: 0 });
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewStudent: async (req, res, next) => {
    try {
      const student = new Student(req.body);
      const result = await student.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  findStudentById: async (req, res, next) => {
    const id = req.params.id;
    try {
      const student = await Student.findById(id);
      if (!student) {
        throw createError(404, 'Student does not exist.');
      }
      res.send(student);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Student id'));
        return;
      }
      next(error);
    }
  },

  updateAStudent: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };

      const result = await Student.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, 'Student does not exist');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, 'Invalid Student Id'));
      }

      next(error);
    }
  },

  deleteAStudent: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Student.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, 'Student does not exist.');
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, 'Invalid Student id'));
        return;
      }
      next(error);
    }
  }
};