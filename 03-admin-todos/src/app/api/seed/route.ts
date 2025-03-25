import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request) {


    const { searchParams } = new URL(request.url);
    const take = searchParams.get('take') ?? '10';
    if (isNaN(+take)) {
        
    }
    let todos = await prisma.tODO.findMany({
        take:+take
    });

    return NextResponse.json({
        msg: "Todo List",
        data: todos
    })

}