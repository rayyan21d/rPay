import { PrismaClient } from "@repo/db/client";
import { NextResponse } from "next/server";

const client = new PrismaClient();

export const GET= async ()=>{

    

    const userr = await client.user.create({
        data:{
            email: "theOnlyEzio@gmail.com",
            name: "Ezio Auditore"
        }
    })

    return NextResponse.json({message: "User Created",
        user: userr
    })
}