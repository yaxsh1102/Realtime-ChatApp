import express, { Request, Response } from 'express';
import { signup, login } from "../controllers/auth.controller";
import { SignupDTO } from '../dtos/signup.dto';
import { LoginDTO } from '../dtos/login.dto'; 

const router = express.Router();

const signupHandler = (req: Request<{}, {}, SignupDTO>, res: Response) => {
  signup(req, res);
}; 

const loginHandler = (req: Request<{}, {}, LoginDTO>, res: Response) => {
  login(req, res);
};

router.post("/signup", signupHandler);
router.post("/login", loginHandler);

export default router;
