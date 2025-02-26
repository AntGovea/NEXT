import { NextResponse } from "next/server";

export function GET(request:Request) {
    return NextResponse.json({
        hola:"mundo",
    })
    
}
export function POST(request:Request) {
    return NextResponse.json({
        hola:"mundo post",
    })
    
}