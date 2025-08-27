import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function GET(request: Request) {

    //borarr tosdos los todos
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
        data: {
            email: 'test1@google.com',
            password: bcrypt.hashSync('123456'),
            roles: ['admin', 'client', 'super-user'],
            todos: {
                create:
                    [
                        { description: 'Piedra del alma', complete: true },
                        { description: 'Piedra del poder' },
                        { description: 'Piedra del tiempo' },
                        { description: 'Piedra del espacio' },
                        { description: 'Piedra del realidad' },

                    ]

            }
        }
    })

   return NextResponse.json({
        mesage: "Seed excecuted"
    })

}