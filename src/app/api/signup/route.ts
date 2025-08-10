import UserModel from "@/model/user";
import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username , email , password,} = await request.json()
        
        const existingVerifiedUserByUsername =  await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVerifiedUserByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(1000000 + Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                success:false,
                message:"User already exists"
            })
            }else{
                const hashPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hashPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserByEmail.save()
            }
        }else{
            const hashPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = await UserModel.create({
                username,
                email,
                password:hashPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
            })
            if(!newUser){
                return Response.json({
                    success:false,
                    message:"Opps ,Sever error"
                })
            }
        }
        // send verification email

        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:"Error sending Email"
            },{status:500})
        }

        return Response.json({
            success:true,
            message:"User registered Successfully , please verify your email"
        })

    } catch (error) {
        console.error("Error registering user",error);
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {status:500}
        )
        
    }
}

