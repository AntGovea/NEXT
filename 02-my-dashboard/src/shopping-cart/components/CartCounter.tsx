'use client'

import CounterPage from "@/app/dashboard/counter/page"
import { useAppDispatch, useAppSelector } from "@/store"
import { decrementOne, incrementOne, initCounterState, resetCount } from "@/store/counter/counterSlice"
import { count } from "console"
import { useEffect } from "react"

interface Props {
  value?: number
}
export interface CounterResponse {
  method: string;
  count: number;
}

const getApiCounter = async (): Promise<CounterResponse> => {
  const data = await fetch(`/api/counter`).then(res => res.json())
  console.log('data', data)
  return data
}


export const CartCounter = ({ value = 0 }: Props) => {

  // const [counter, setCounter] = useState(value)

  //obtenemos el valor del contador
  const count = useAppSelector(state => state.counter.count);
  //generamos una variable que nos permita despachar las acciones del slice
  const dispatch = useAppDispatch();



  //al montar el component obtendremos el valor del contador y lo inicializaremos

  useEffect(() => {
    getApiCounter().then(
      ({ count }) => {
        dispatch(initCounterState(count))
      }
    );
  }, [dispatch])


  // useEffect(() => {
  // dispatch(resetCount(value));
  // }, [])

  return (
    <div>
      <span className='p-8 m-8 text-9xl'>{count}</span>
      <div className='flex gap-8'>
        <button onClick={() => dispatch(incrementOne())}
          className='flex items-center justify-center p-8 text-3xl font-bold rounded-xl
         bg-gray-900 text-white hover:bg-gray-600 transition-all'>
          +1
        </button>
        <button onClick={() => dispatch(decrementOne())}
          className='flex items-center justify-center p-8 text-3xl font-bold rounded-xl
         bg-gray-900 text-white hover:bg-gray-600 transition-all'>
          -1
        </button>
      </div>

    </div>
  )
}
