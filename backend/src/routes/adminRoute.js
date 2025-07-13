import express from 'express';
import * as AdminController from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', AdminController.register);
router.post('/login', AdminController.login);

export default router;