import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { createProperty, getProperties, togglePropertyAvailability, getAdminProperties, updateProperty, deleteProperty } from '../controllers/propertyController.js';
import { get } from 'mongoose';

const propertyRouter = express.Router();

propertyRouter.post('/', protect, upload.array("images", 4), createProperty)
propertyRouter.get('/', getProperties)
propertyRouter.get('/admin', protect, getAdminProperties)
propertyRouter.post('/toggle-availability', protect, togglePropertyAvailability)
propertyRouter.put('/:id', protect, updateProperty)
propertyRouter.delete('/:id', protect, deleteProperty)


export default propertyRouter;