import express from 'express';

import db from "@repo/db/client";
const app = express();

app.post("/hdfcWebhook", async (req, res)=>{

    // use a webhook secret to check if request actually came from an hdfc bank
    const paymentInfo = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount,
    }

    // update the payment status in the database 
    // use transactions to process these sensitive database calls

   try{
        await db.$transaction([

            db.balance.update({

            where:{
                userId: paymentInfo.userId
            },
            data :{

                amount: {
                    // can also get this from db and increment 
                    increment: paymentInfo.amount;
                }

            }

            }),

            db.onRampTransaction.update({
                where:{
                    token: paymentInfo.token
                },
                data:{
                    status: "Success"
                }
            })

        ])

        res.status(200).json({
            message: "Captured"
        })
   }catch(e){
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })

   }


})

app.listen(3003, ()=>{console.log('Server is running on port 3003')});

// we need a balances table and an onramp 
// transactions table aswell