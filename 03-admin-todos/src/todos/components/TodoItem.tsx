'use client'
import { TODO } from "@prisma/client"
import styles from "./TodoItem.module.css"
import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5"

interface Props {
  todo: TODO,

  //TODO actions

  toggleTodo:(id:string,complete:boolean)=>Promise<TODO | void>

}

export const TodoItem = ({ todo,toggleTodo }: Props) => {
  return (
    <div className={todo.complete ? styles.todoDone : styles.todoPending}>

      <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
        <div 
        onClick={ ()=> toggleTodo(todo.id,!todo.complete ) }
        
        className={`flex rounded-md cursor-pointer
       hover:bg-opacity-60
       ${todo.complete? "bg-blue-100" :"bg-red-100"}
       `}>
          {
            todo.complete ?
              <IoCheckboxOutline size={30} />
              :
              <IoSquareOutline size={30} />
          }

        </div>
        <div className="text-cente sm:text-left">

          {`
        $  {todo.id}
        ${todo.description}
        ${todo.createdAt}
        ${todo.complete}
        ${todo.updatedAt}
        `}
        </div>
      </div>

    </div>
  )
}
