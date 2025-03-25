import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as yup from 'yup';

export async function GET(request: Request) {

try {
    
    const { searchParams } = new URL(request.url);
    const take = Number(searchParams.get('take') ?? '10');
    const skip = Number(searchParams.get('skip') ?? '0');
    
    if (isNaN(+take)) {
        return NextResponse.json({
            message: 'Take need be a number'
        }, { status: 400 });
    }
    if (isNaN(+skip)) {
        return NextResponse.json({
            message: 'skip need be a number'
        },
        { status: 400 });

    }
    
    
    
    let todos = await prisma.tODO.findMany({
        take,
        skip,
    });
    
    return NextResponse.json({
        msg: "Todo List",
        data: todos
    })
    
  
} catch (error) {
return NextResponse.json({
    msg:"Error ocurred to get all todos",
    data:error,

})
}
}


export async function POST(request: Request) {
    try {
        const postSchema = yup.object({
            description: yup.string().required(),
            complete: yup.boolean().optional().default(false),
        });

        let { description, complete } = await postSchema.validate(await request.json());
        let data = await prisma.tODO.create({
            data: {
                description,
                complete,
            }
        });

        return NextResponse.json({
            message: "Create todo successfully",
            data,
        });

    } catch (error) {
        return NextResponse.json({
            message: "Error in POST function",
            data: error
        }, { status: 400 });
    }
}