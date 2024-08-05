import express from 'express';
import { accessChat, allChatsOfLoginedUser, createGroupChat } from '../controllers/chatContoller.js';
import { authMiddleware } from '../middleware/userAuthMiddleware.js';

const chatRouter=express.Router();
chatRouter.post('/access-chat',authMiddleware,accessChat)
chatRouter.get('/all-chats',authMiddleware,allChatsOfLoginedUser);
chatRouter.post('/create-group',authMiddleware,createGroupChat);

export {chatRouter}