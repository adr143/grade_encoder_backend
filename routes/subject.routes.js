import express from 'express';
import {
  createSubject,
  getAllSubjects,
  deleteSubject,
  updateSubject
} from '../controllers/subject.controller.js';

const router = express.Router();

router.post('/', createSubject);           // ➕ Add new subject
router.get('/', getAllSubjects);           // 📥 Fetch all subjects
router.delete('/:id', deleteSubject);      // ❌ Delete a subject
router.put('/:id', updateSubject);      // Update a subject

export default router;
