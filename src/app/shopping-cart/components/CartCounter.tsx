'use client'

import { useState } from "react"

interface Props {
    value?:number
  }

export const CartCounter = ({value=0}:Props) => {

    const [counter, setCounter] = useState(value)

  return (
    <div>
         <span className='p-8 m-8 text-9xl'>{counter}</span>
      <div className='flex gap-8'>
        <button onClick={() => setCounter(counter + 1) } 
        className='flex items-center justify-center p-8 text-3xl font-bold rounded-xl
         bg-gray-900 text-white hover:bg-gray-600 transition-all'>
          +1
        </button>
        <button onClick={() =>setCounter(counter - 1) }
        className='flex items-center justify-center p-8 text-3xl font-bold rounded-xl
         bg-gray-900 text-white hover:bg-gray-600 transition-all'>
          -1
        </button>
      </div>

    </div>
  )
}
