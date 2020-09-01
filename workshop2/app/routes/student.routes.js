const express = require('express');
const router = express.Router();

const StudentController = require('../controllers/student.controller');

router.get('/', StudentController.getAllStudents);

router.post('/', StudentController.createNewStudent);

router.get('/:id', StudentController.findStudentById);

router.patch('/:id', StudentController.updateAStudent);

router.delete('/:id', StudentController.deleteAStudent);

module.exports = router;