import Image from 'next/image'
import { IoBrowsersOutline, IoCalculator, IoEarthSharp, IoFootball, IoHeartCircleSharp, IoLogoReact } from 'react-icons/io5'
import { SidebarMenuItem } from './SidebarMenuItem'
import { BiHeartCircle } from 'react-icons/bi'

export const Sidebar = () => {


const menItems=[

    {
        path:"/dashboard/main",
        icon:  <IoBrowsersOutline size={40} />,
        title:"Dashboard",
        subTitle:"Visualizacion",
    },
    {
        path:"/dashboard/counter",
        icon:  <IoCalculator size={40} />,
        title:"Counter",
        subTitle:"Contador Client Side",
    },
    {
        path:"/dashboard/pokemons",
        icon:  <IoFootball size={40} />,
        title:"Pokemons",
        subTitle:"Estaticos",
    },
    {
        path:"/dashboard/favorites",
        icon:  <IoHeartCircleSharp size={40} />,
        title:"Favoritos",
        subTitle:"pokemons",
    },
]



  return (
    <div id="menu" 
    style={{width:"400px"}}
    className="bg-gray-900 min-h-screen z-10 text-slate-300 w-64 left-0 n overflow-y-scroll">
    <div id="logo" className=" my-4 px-6">
        <h1 className="flex items-center text-lg md:text-2xl font-bold text-white">
        <IoLogoReact />
            <span>Dashboard</span>
            </h1>
        <p className="text-slate-500 text-sm">dashboard usando next</p>
    </div>
    <div id="profile" className="px-6 py-10">
        <p className="text-slate-500">Welcome back,</p>
        <a href="#" className="inline-flex space-x-2 items-center">
            <span>
                <Image width={50} height={50} className="rounded-full w-8 h-8" 
                src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80"
                 alt="avatar image" />
            </span>
            <span className="text-sm md:text-base font-bold">
                Antonio Govea
            </span>
        </a>
    </div>
    <div id="nav" className="w-full px-6">
     
     {
        menItems.map(item=>
        
            <SidebarMenuItem 
            key={item.title}
            {...item}
            />
        )
       
     } 
       
    </div>
</div>
  )
}

