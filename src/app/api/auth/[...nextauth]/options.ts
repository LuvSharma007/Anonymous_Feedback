import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextAuthOptions } from "next-auth";

export const AuthOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials):Promise<any>{
                await dbConnect()

                if(!credentials?.email || !credentials.password){
                    throw new Error("Email and password is required")
                }

                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials?.email},
                            {password:credentials?.password}
                        ]
                    })

                    if(!user){
                        throw new Error("User not found")
                    }
                    if(user && user.isVerified){
                        throw new Error("please verify your account")
                    }
                    
                    const isPasswordMatched = await bcrypt.compare(credentials?.password,user.password)
                    if(!isPasswordMatched){
                        throw new Error("Email or password is incorrect")
                    }

                    return user;

                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks:{
    async jwt({ token, user,}) {
        if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
        }
        return token
    },
    async session({ session,token }) {
        if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
        }
        return session
    }
    },
    pages:{
        signIn:'/signIn'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}