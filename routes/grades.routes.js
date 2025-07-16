import express from 'express';
import {
  getGradesByStudent,
  getStudentGrades,
  getGradesBySectionAndSubject,
  batchUpdateGrades
} from '../controllers/grades.controller.js';

const router = express.Router();

router.get('/:studentId', getGradesByStudent);

router.get('/:studentId/:sectionId/:subjectId', getStudentGrades);

router.get('/:sectionId/:subjectId', getGradesBySectionAndSubject);

router.put('/:sectionId/:subjectId/batch-update', batchUpdateGrades);

export default router;
