import express from 'express';
import { accessChat, addMemberToGroupChat, allChatsOfLoginedUser, createGroupChat, removeMemberFromGroupChat } from '../controllers/chatContoller.js';
import { authMiddleware } from '../middleware/userAuthMiddleware.js';

const chatRouter=express.Router();
chatRouter.post('/access-chat',authMiddleware,accessChat)
chatRouter.get('/all-chats',authMiddleware,allChatsOfLoginedUser);
chatRouter.post('/create-group',authMiddleware,createGroupChat);
chatRouter.post('/add-member',authMiddleware,  addMemberToGroupChat);
chatRouter.post('/remove-member',authMiddleware,removeMemberFromGroupChat);

export {chatRouter}