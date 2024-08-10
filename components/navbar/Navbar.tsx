import { HomeIcon } from '@primer/octicons-react'
import Link from 'next/link'
import React from 'react'
import ActiveLink from '@/components/active-link/ActiveLink'

function Navbar() {


    const navItems=[
        {path:"/about" , text:"About"},
        {path:"/pricing" , text:"Pricing"},
        {path:"/contact" , text:"Contact"},
        {path:"/other" , text:"other"},

    ]


    return (
        <nav className='flex bg-blue-800 bg-opacity-30 p-2 m-2 rounded'>

            <Link href={"/"} className='flex items-center'>
                <HomeIcon className='mr-2' />
                <span>Home</span>
            </Link>

            <div className='flex flex-1'></div>


{
    navItems.map((navItem)=>
    
        <ActiveLink key={navItem.path} {...navItem} />
    )
}

        </nav>
    )
}

export default Navbar