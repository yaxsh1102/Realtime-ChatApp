import { Request , Response } from "express"
import { SignupDTO } from "../dtos/signup.dto"
import { ErrorResponseDTO } from "../dtos/error.dto"
import { User } from "../models/user.schema";
import bcrypt from 'bcrypt'
import { SuccessResponseDTO } from '../dtos/success.dto';
import { LoginDTO } from "../dtos/login.dto";
import jwt from "jsonwebtoken"


export const signup  = async (req: Request<{} , {} , SignupDTO>, res: Response):Promise<Response> => {
  try {
    const { name, username, email, password } = req.body;

    if (!name  ||  !username  || !email || !password) {
      const errorResponse: ErrorResponseDTO = {
        success: false,
        message: 'All fields (name, username, email, password) are required.',
      };
      return res.status(400).json(errorResponse);
    }

    const existingUser = await User.findOne({$or:[{name:name} , {username:username}]})

    if(existingUser){
        const errorResponse: ErrorResponseDTO = {
            success: false,
            message: 'User Already Exists',
          };
          return res.status(400).json(errorResponse);
        }

         const hashedPassword = await  bcrypt.hash(password ,10) ;



    const newUser = await User.create({
        name ,
        email ,
        password:hashedPassword ,
        avatar:"ht"


    })

    const successResponse :SuccessResponseDTO<typeof newUser> ={
        success:true ,
        message:"User Registered Successfully",
        data:newUser

    }

    return res.status(200).json(newUser)


  } catch (err) {
    
    const errorResponse: ErrorResponseDTO = {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
    return res.status(500).json(errorResponse);
  }
};


export const login  = async(req:Request<{} ,{} ,LoginDTO > , res:Response): Promise<Response> =>{

    try{
        const {username , email , password}=req.body 
        if((!username && !email) && !password ){
            const errorResponse: ErrorResponseDTO = {
                success: false,
                message: 'All fields (name, username, email, password) are required.',
              };
              return res.status(400).json(errorResponse);
            }

        

    let user =null;
    if(email){
        user = await User.findOne({email:email})
    } else {
        user = await User.findOne({username:username})


    }

    if(!user){
        const errorResponse: ErrorResponseDTO = {
            success: false,
            message: 'No such User Found.',
          };
          return res.status(400).json(errorResponse);
        }
    if(!await bcrypt.compare(password , user.password)){
        const errorResponse: ErrorResponseDTO = {
            success: false,
            message: 'Incorrect Password',
          };
          return res.status(400).json(errorResponse);
        }


        const payload = {
            email:user.email ,
            id:user._id ,
        }
        const token = jwt.sign(payload , process.env.JWT_SECRET as string , {
            expiresIn:"2h"

        })

       
    
        const successResponse :SuccessResponseDTO<{}> ={

            success:true ,
            message:"User Registered Successfully",
            data:{token:token}
    
        }


    return res.status(200).json(successResponse)

    

    }catch(err){
        const errorResponse: ErrorResponseDTO = {
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
          };
          return res.status(500).json(errorResponse);
        }

    }