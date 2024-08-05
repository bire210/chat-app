import exprss from "express";
import { login, register, search } from "../controllers/userContoller.js";

const userRouter=exprss.Router();
userRouter.post("/sign-up",register)
userRouter.post("/login",login)
userRouter.get("/find-friend",search)


export {userRouter}