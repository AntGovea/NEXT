import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request:Request){

await prisma.tODO.deleteMany();
await prisma.tODO.createMany({
    data:[
      {  description:"Piedra de alma",complete:true},
      {  description:"Piedra de tiempo",complete:false},
      {  description:"Piedra de poder",complete:false},
      {  description:"Piedra de espacio",complete:false},
      {  description:"Piedra de realidad",complete:false},
    ]
})


const todo=await prisma.tODO.create({
    data:{
        description:"Piedra de alma",
        complete:true,
    }
})

console.log(todo)
    
    return NextResponse.json({
        msg:"Seed Exceuted"
    })
}