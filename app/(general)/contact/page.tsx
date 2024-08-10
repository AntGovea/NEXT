import { Metadata } from 'next'
import React from 'react'


export const metadata:Metadata={
    title:"Contact Page",
    description:"descrption contact page",
    keywords:["other page","metdadtas"],
}
function Contact() {
  return (
    <div className='text-7xl'>Contact</div>
  )
}

export default Contact