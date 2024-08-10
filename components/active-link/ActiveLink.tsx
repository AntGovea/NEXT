'use client'
import Link from 'next/link'
import React from 'react'
import style from "./ActiveLink.module.css"
import { usePathname } from 'next/navigation'
interface ActiveLinkProps {
    path: string,
    text: string,

}


function ActiveLink({ path, text }: ActiveLinkProps) {

    //me regresa el path en el que me encuentro
const pathName=usePathname();

console.log('pathName',pathName)

    return (
        <Link className={`${style.link} ${(pathName===path)&& style['active-link']}`} href={path}>{text}</Link>
    )
}

export default ActiveLink