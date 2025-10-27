import express from 'express';
import { atsScore, autoStructure } from '../controllers/aiController.js';

const router = express.Router();

// AI routes
router.post('/ats-score', atsScore);
router.post('/auto-structure', autoStructure);




export default router;




