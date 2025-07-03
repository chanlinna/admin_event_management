// Define Express routes/endpoints for user-related API calls
// routes/userRoutes.js
import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.post('/users', userController.createUser);
router.put('/users/:username', userController.updateUser);  // use username param
router.delete('/users/:username', userController.deleteUser);  // use username param

export default router;

