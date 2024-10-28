import express, { Request, RequestHandler, Response } from 'express';
import { signup, login } from "../controllers/auth.controller";
import { SignupDTO } from '../dtos/signup.dto';
import { LoginDTO } from '../dtos/login.dto'; 
import { AuthenticatedUser, AuthenticatRequest } from '../middlewares/auth.middleware';
import { getUser } from '../controllers/auth.controller';
import { awakeServer } from '../controllers/auth.controller';

const router = express.Router();

const signupHandler = (req: Request<{}, {}, SignupDTO>, res: Response) => {
  signup(req, res);
}; 

const loginHandler = (req: Request<{}, {}, LoginDTO>, res: Response) => {
  login(req, res);
};

const fetchUserhandler = (req: Request<{} , {} , null>, res: Response) => {
  getUser(req as AuthenticatRequest<null>, res);
};
const awakeServerHandler = (req: Request<{} , {} , {}>, res: Response) => {
  awakeServer(req, res); 
};

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.get("/get-user",  AuthenticatedUser as RequestHandler , fetchUserhandler);
router.get("/awake-server" , awakeServerHandler)


export default router;
