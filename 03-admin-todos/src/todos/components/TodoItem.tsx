'use client'
import { TODO } from "@prisma/client"
import styles from "./TodoItem.module.css"
import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5"
import { startTransition, useOptimistic } from "react"

interface Props {
  todo: TODO,
  //TODO actions
  toggleTodo: (id: string, complete: boolean) => Promise<TODO | void>
}



export const TodoItem = ({ todo, toggleTodo }: Props) => {

  //* state toggle optimist
  //*1 argumento: valor inicial
  //*2 argumento: callback(oldState,newValueTochange)={}
  //* intrucciones: pasar las mismas propiedades modificando el complete
  const [todoOptimistic, toggleTodoOptimistic] = useOptimistic(todo,
    (state, newCompleteValue: boolean) => ({
      ...state, complete: !newCompleteValue
    })
  );

  const onToggleTodo =async () => {
    try {
      startTransition(()=>toggleTodoOptimistic(!todoOptimistic.complete))
      //haciendo el cambio con el toggle para la interface
      toggleTodoOptimistic(!todoOptimistic.complete);
      //haciendo el cambio en el back
      await toggleTodo(todoOptimistic.id, !todoOptimistic.complete)
    } catch (error) {
      //aun que haya error, debemos hacer el cambio, ya que en el front el cambio ya fue reflejado
      startTransition(()=>toggleTodoOptimistic(!todoOptimistic.complete))
    }

  }


  return (
    <div className={todoOptimistic.complete ? styles.todoDone : styles.todoPending}>

      <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
        <div
          // onClick={() => toggleTodo(todoOptimistic.id, !todoOptimistic.complete)}
          onClick={() => onToggleTodo()}

          className={`flex rounded-md cursor-pointer
       hover:bg-opacity-60
       ${todoOptimistic.complete ? "bg-blue-100" : "bg-red-100"}
       `}>
          {
            todoOptimistic.complete ?
              <IoCheckboxOutline size={30} />
              :
              <IoSquareOutline size={30} />
          }

        </div>
        <div className="text-cente sm:text-left">

          {`
        ${todoOptimistic.description}
        `}
        </div>
      </div>

    </div>
  )
}
