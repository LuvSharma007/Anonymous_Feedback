import {z} from 'zod'

export const messagesSchema = z.object({
    content:z
    .string()
    .min(10,{message:'content must be at least of 10 characters'})
    .max(200,{message:"Content must be no longer than 300 characters"})
})