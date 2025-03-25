import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as yup from "yup";


//Interfaces
interface Segments {
    params: {
        id: string,
    }
}

//Schemas

const putSchema = yup.object({
    complete: yup.boolean().optional(),
    description: yup.string().optional(),
});

//Functions
const getTodo = async (id: string) => {

    return await prisma.tODO.findFirst({ where: { id } });

}
export async function GET(request: Request, { params }: Segments) {
    try {
        const { id } = await params;

        let todo = await getTodo(id);

        return NextResponse.json({
            message: "get todo by id successfully",
            data: todo
        })

    } catch (error) {
        return NextResponse.json({
            message: "Error",
            data: error,
        })
    }
}








export async function PUT(request: Request, { params }: Segments) {
    try {
        const { id } = await params;

       
        let todo = await getTodo(id);
        if (!todo) {
            return NextResponse.json({
                message: `Todo with id: ${id} is not exist`,
                data: [],
            },
                { status: 404 })
        }

        let { complete, description, ...rest } = await putSchema.validate(await request.json());
        const updatedTodo = await prisma.tODO.update(
            {
                where: { id },
                data: {
                    complete,
                    description,

                }
            })
        return NextResponse.json({
            message: "Updated Todo",
            data: updatedTodo
        })

    } catch (error) {
        return NextResponse.json(error, {
            status: 400
        })
    }
}