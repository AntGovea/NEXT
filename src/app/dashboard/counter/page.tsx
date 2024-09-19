import { CartCounter } from "@/shopping-cart"



function CounterPage() {



  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <span className='p-8 m-8 text-3xl font-bold'>Productos en el carrito</span>
      <CartCounter value={20}/>

    </div>
  )
}

export default CounterPage