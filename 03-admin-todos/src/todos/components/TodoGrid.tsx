'use client'
import { TODO } from "@prisma/client"
import { TodoItem } from "./index"
import { useRouter } from "next/navigation";
// import * as todosApi from '@/todos/helpers/todos';
import { toggleTodo } from "../actions/todo-actions";

interface Props {
  todos?: TODO[];
}




export const TodoGrid = ({ todos = [] }: Props) => {
  const router = useRouter();
    
  // const toggleTodo = async (id: string, complete: boolean) => {
  //   const updateTodo = await todosApi.updateTodo(id, complete);
  //   console.log({ updateTodo })
  //   router.refresh();
  // }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      
      {todos?.map(todo => (
        <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo}/>
      )
      )}


    </div>
  )
}
