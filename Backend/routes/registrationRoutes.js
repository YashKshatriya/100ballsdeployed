import express from 'express';
import {
  registerUser,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} from '../controllers/registrationController.js';
import { validateRegistration } from '../middleware/validation.js';

const router = express.Router();

// Registration route
router.post('/register', validateRegistration, registerUser);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

export default router;
