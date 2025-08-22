import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";


export async function POST(request:Request){
    await dbConnect()

    try {
        const {username, code} =  await request.json()
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success:false,
                message:"User not Found"
            },{status:500})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save();
            return Response.json({
                success:true,
                message:"Account verified successfully"
            },{status:200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verified Code is expired , please signup again to get a new Code"
            },{status:500})
        }else{
            return Response.json({
                success:false,
                message:"Incorrect Verification Code"
            },{status:500})
        }
    } catch (error) {
        console.error("Error Verifying user",error);
        return Response.json({
            success:false,
            message:"Error Verifying user"
        },
        {status:500}
    )
    }

}


