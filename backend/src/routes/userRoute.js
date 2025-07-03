// Define Express routes/endpoints for user-related API calls
import express from "express";
import {
  createUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Create
router.post("/users", createUser);

// Update
router.put("/users/:id", updateUser);

// Delete
router.delete("/users/:id", deleteUser);

export default router;
