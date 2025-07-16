import express from 'express';
import {
  createGradeFormulasForAssignment,
  getAllTermGradeFormulas,
  submitGradeFormulaChanges
} from '../controllers/gradeFormula.controller.js';

const router = express.Router();

router.post('/create', createGradeFormulasForAssignment);

router.get('/:sectionId/:subjectId', getAllTermGradeFormulas);

router.post('/:section/:subject/:term', submitGradeFormulaChanges);

export default router;
