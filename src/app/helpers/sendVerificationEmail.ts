import { resend } from "@/lib/resend";
import VerificationEmailTemplate from "../../../emails/verificationEmailTemplate";

import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Anonymous Feedback | Verification Code',
        react:VerificationEmailTemplate({username,otp:verifyCode}),
        })
        return {success:true,message:"Verification email send successfully"}
    } catch (emailError) {
        console.error("Enter sending verification email",emailError)        
        return {success:false,message:"Error verifying Verification email"}
    }
}