import prisma from "@/lib/prisma";
import { TodoGrid } from "@/todos/components";
import { NewTodo } from "@/todos/components/NewTodo";


export const metadata = {
    title: 'Listado de todos',
    description: 'SEO Title',
}

export default async function ServerTodosPage() {

    const todos = await prisma.tODO.findMany({ orderBy: { description: 'asc' } });

    return (
        < >
        <span className="text-3xl mb-10 ">Server Actions</span>
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