import express from 'express';
import { createYearLevel, getAllYearLevels, getYearLevelById, deleteYearLevel, assignSectionsToYearLevel } from '../controllers/yearLevel.controller.js';

const router = express.Router();

router.post('/', createYearLevel);

router.get('/', getAllYearLevels);

router.get('/:id', getYearLevelById);

router.delete('/:id', deleteYearLevel);

router.put('/assign-sections', assignSectionsToYearLevel);

export default router;
