import express from 'express';
import { createResume, listResumes, getResume, updateResume, deleteResume } from '../controllers/resumeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All resume routes require authentication
router.use(requireAuth);

// CRUD routes
router.post('/', createResume);           // POST /api/resumes
router.get('/', listResumes);             // GET /api/resumes
router.get('/:id', getResume);            // GET /api/resumes/:id
router.put('/:id', updateResume);         // PUT /api/resumes/:id
router.delete('/:id', deleteResume);      // DELETE /api/resumes/:id

export default router;



