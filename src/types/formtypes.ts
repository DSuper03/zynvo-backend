import { z } from "zod";

export const signupSchema = z.object({
    password : z.string()
    .min(5, "Password must be at least 5 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character") ,
    email : z.string().email("invalid email id"),
    name : z.string()
})


