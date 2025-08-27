export const dynamic = 'force-dynamic';
export const revalidate = 0;


import prisma from "@/lib/prisma";
import { TodoGrid } from "@/todos/components";
import { NewTodo } from "@/todos/components/NewTodo";


export const metadata = {
    title: 'Listado de todos',
    description: 'Todos----',
}
export default async function ServerTodosPage() {

    const todos = await prisma.todo.findMany({ orderBy: { description: 'asc' } });

    return (
        <>
            <span className="text-3xl mb-10">Server Actions</span>
            {/* <h1 className="text-5xl">
                {JSON.stringify(todos)}

            </h1> */}
            <div className="w-full px-6 mb-5 ">
                <NewTodo />
            </div>
            <TodoGrid todos={todos} />
        </>
    )
}