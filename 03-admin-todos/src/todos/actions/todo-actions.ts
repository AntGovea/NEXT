'use server';

import prisma from "@/lib/prisma";
import { TODO } from "@prisma/client";
import { revalidatePath } from "next/cache";



export const sleep = async (seconds: number = 0) => (
    new Promise(resolve => (
        setTimeout(resolve, seconds * 1000)
    )
    )
)

export const toggleTodo = async (id: string, complete: boolean): Promise<TODO> => {
    await sleep(3);

    const todo = await prisma.tODO.findFirst({ where: { id } });

    if (!todo) {
        throw `Todo con id ${id} no encontrado`
    }
    const updateTodo = await prisma.tODO.update({ where: { id }, data: { complete } })
    revalidatePath('/dashboard/server-todos');
    return updateTodo;
}

export const addTodo = async (description: string) => {

    try {
        const todo = await prisma.tODO.create({ data: { description } });
        revalidatePath('/dashboard/server-todos')

        return todo;
    } catch (error) {
        return {
            message: `Error to create new todo ${error}`
        }
    }



}

export const deteleCompleted = async (): Promise<void> => {

    try {

        let data = await prisma.tODO.deleteMany({
            where: {
                complete: true,
            }
        });
        revalidatePath('dashboard/server-todos')


    } catch (error) {
        console.log(`Error to delete completes todos`)
    }

    let data = await prisma.tODO.deleteMany({
        where: {
            complete: true,
        }
    });





}







