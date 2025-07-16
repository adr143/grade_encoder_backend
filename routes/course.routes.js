import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourse
} from '../controllers/course.controller.js';

const router = express.Router();

router.post('/', createCourse);               // ➕ Create Course
router.get('/', getAllCourses);               // 📥 Fetch all Courses
router.get('/:id', getCourseById);            // 📑 Get Course by ID
router.delete('/:id', deleteCourse);
router.put('/:id', updateCourse);


export default router;
