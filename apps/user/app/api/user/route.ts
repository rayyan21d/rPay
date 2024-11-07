import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";


export const GET = async()=>{
    try{
        const session = await getServerSession(authOptions);
        if(session.user){
            return NextResponse.json({
                user: session.user
            })
        }
    }catch(e){
        console.log(e)
        return NextResponse.json({
        message: "Not logged in"
    },{
        status: 403
    })
    }

    
}