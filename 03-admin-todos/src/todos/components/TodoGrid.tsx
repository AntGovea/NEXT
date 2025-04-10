'use client'
import { TODO } from "@prisma/client"
import { TodoItem } from "./index"
import * as api from '@/todos/helpers/todos';

interface Props {
  todos?: TODO[];
}




export const TodoGrid = ({ todos = [] }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

      {todos?.map(todo => (
        <TodoItem key={todo.id} todo={todo} toggleTodo={api.updateTodo}/>
      )
      )}


    </div>
  )
}
