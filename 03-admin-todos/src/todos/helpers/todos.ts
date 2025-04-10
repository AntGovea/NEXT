import { TODO } from "@prisma/client";



export const updateTodo = async (id: string, complete: boolean): Promise<TODO> => {

    const body = { complete };
    //*como el proyecto es local , la url puede empezar desde api ya que es localhost
    const todo = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());
    console.log({todo})
    return todo
}