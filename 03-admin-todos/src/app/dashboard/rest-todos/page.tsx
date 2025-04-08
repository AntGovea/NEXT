import prisma from "@/lib/prisma";


export const metadata = {
    title: 'Listado de todos',
    description: 'Todos----',
}
export default async function RestTodosPage() {

    const todos = await prisma.tODO.findMany({ orderBy: { description: 'asc' } });

    return (
        <div>

            <h1 className="text-5xl">
                {JSON.stringify(todos)}

            </h1>
        </div>
    )
}