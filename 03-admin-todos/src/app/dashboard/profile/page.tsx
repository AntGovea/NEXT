'use client'

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function ClientProfie() {
    const { data: session } = useSession()

    useEffect(() => {
        console.log('client profile')
    }, [])

    return (
        <>
            <div className="">
                <h1>Page profile</h1>

                <hr />

                <div className="flex fex-col">
                    <span>{session?.user?.name??'No Name'}</span>
                    <span>{session?.user?.email??'No Email'}</span>
                    <span>{session?.user?.image??'No Image'}</span>
                </div>
            </div>
        </>

    )






}