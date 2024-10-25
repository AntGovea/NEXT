'use client'

import { useAppDispatch, useAppSelector } from "@/store"
import { decrementOne, incrementOne, resetCount } from "@/store/counter/counterSlice"
import { useEffect } from "react"

interface Props {
    value?:number
  }

export const CartCounter = ({value=0}:Props) => {

    // const [counter, setCounter] = useState(value)
    

    const counter =useAppSelector(state=>state.counter.count);
    const dispatch=useAppDispatch();



    useEffect(() => {
    dispatch(resetCount(value));
    }, [])
    
  return (
    <div>
         <span className='p-8 m-8 text-9xl'>{counter}</span>
      <div className='flex gap-8'>
        <button onClick={() => dispatch(incrementOne()) } 
        className='flex items-center justify-center p-8 text-3xl font-bold rounded-xl
         bg-gray-900 text-white hover:bg-gray-600 transition-all'>
          +1
        </button>
        <button onClick={() =>dispatch(decrementOne()) }
        className='flex items-center justify-center p-8 text-3xl font-bold rounded-xl
         bg-gray-900 text-white hover:bg-gray-600 transition-all'>
          -1
        </button>
      </div>

    </div>
  )
}
