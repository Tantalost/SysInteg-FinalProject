import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSearchRooms, createUser, promoteToAdmin  } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSearchRooms);

userRouter.post('/create', createUser);
userRouter.patch('/make-admin/:id', protect, promoteToAdmin);


export default userRouter;