import CredentialsProvider from "next-auth/providers/credentials";

import db from "@repo/db/client";
import {z} from "zod";
import bcrypt from "bcrypt";

const SignUpSchema = z.object({ 
    phone: z.string().min(10).max(10),
    password: z.string()
});

export const authOptions = {
    providers:[
        CredentialsProvider({
            name: "Phone number",
            credentials:{
                username:{ label: "Username", type: "text", placeholder: "Username", required: true},
                phone:{ label: "Phone", type: "text", placeholder: "Phone", required: true },
                password:{ label: "Password", type: "password", placeholder: "Password", required: true}
            },
            async authorize(credentials:any){
                // zod validation logic
                console.log("Credentials", credentials);
                try{
                    SignUpSchema.parse(credentials);

                }catch(e){
                    console.log(e)
                    return null;
                }

               
                const existingUser = await db.user.findFirst({
                    where:{
                        number: credentials.phone
                    }
                })

                console.log("existingUser", existingUser)

                if(existingUser){

                    console.log("User exists")
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password)

                    if(passwordValidation){
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            phone: existingUser.number
                        }
                    
                    }else{
                        // you cannot return a custom error message
                        return null
                    }

                  
                }
            
               try{
                    // If new user
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    const user = await db.user.create({
                        data:{
                            name: credentials.username,
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
               
               return null
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