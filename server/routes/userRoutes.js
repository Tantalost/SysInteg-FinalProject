import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSearchRooms, createUser, promoteToAdmin, getUserCount  } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.get('/count', protect, getUserCount);
userRouter.post('/store-recent-search', protect, storeRecentSearchRooms);

userRouter.post('/create', createUser);
userRouter.patch('/make-admin/:id', protect, promoteToAdmin);


export default userRouter;