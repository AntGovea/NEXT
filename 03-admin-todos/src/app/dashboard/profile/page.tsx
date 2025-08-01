'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function ClientProfie() {
    const { data: session } = useSession()

    useEffect(() => {
        console.log('client profile')
    }, [])

    return (
        
            <div className="">
                <h1>Page profile</h1>

                <hr />

                <div className="flex flex-col">
                    <span>{session?.user?.name??'No Name'}</span>
                    <span>{session?.user?.email??'No Email'}</span>
                    <span>{session?.user?.image??'No Image'}</span>
                    <span>{session?.user?.id??'No Id'}</span>
                    <span>{session?.user?.roles?.join(',')??'No roles'}</span>
                </div>
                {/* <div className="">
                    {JSON.stringify(session)}
                </div> */}
            </div>
       

    )






}