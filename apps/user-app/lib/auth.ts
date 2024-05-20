import CredentialsProvider from "next-auth/providers/credentials";

import Credentials from "next-auth/providers/credentials";

import db from "@repo/db/client";
import {z} from "zod";
import bcrypt from "bcrypt";

const SignUpSchema = z.object({ 
    phone: z.string().min(10).max(10),
    password: z.string().min(6).max(16)
});

export const authOptions = {
    providers:[
        CredentialsProvider({
            name: "Phone number",
            credentials:{
                phone:{ label: "Phone", type: "text", placeholder: "Phone" },
                password:{ label: "Password", type: "password", placeholder: "Password", required: true}
            },
            async authorize(credentials:{
                
                csrfToken: string,
                phone: string,
                password: string
               
            }){
                // zod validation logic
                console.log(credentials);

               
                const existingUser = await db.user.findFirst({
                    where:{
                        number: credentials.phone
                    }
                })

                console.log(existingUser)

                if(existingUser){

                    console.log("User exists")
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password)

                    if(passwordValidation){
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.email
                        }
                    
                    }

                    return {
                        message: "Password is incorrect"
                    }
                    
                }
            
               try{
                    // If new user
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    const user = await db.user.create({
                        data:{
                            number: credentials.phone,
                            password : hashedPassword
                        }
                    })

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email
                    }
               }catch(e){
                    console.log(e)
               }
               
               return {
                    message: "Auth failed"
                }
            }
        }),

    ],
    secret: "secret",
    callbacks:{

       async session({ token, session }: any) {
            session.user.id = token.sub
            
            return session
        }
    }

}