import { Message } from "@/model/user"


export interface ApiResponse{
    success:boolean
    message:string,
    isAccessptingMessages?:boolean
    messages?:Array<Message>
}