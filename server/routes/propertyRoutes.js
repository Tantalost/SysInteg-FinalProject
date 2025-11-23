import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { createProperty, getProperties, togglePropertyAvailability, getAdminProperties } from '../controllers/propertyController.js';
import { get } from 'mongoose';

const propertyRouter = express.Router();

propertyRouter.post('/', protect, upload.array("images", 4), createProperty)
propertyRouter.get('/', getProperties)
propertyRouter.get('/admin', protect, getAdminProperties)
propertyRouter.get('/toggle-availability', protect, togglePropertyAvailability)


export default propertyRouter;