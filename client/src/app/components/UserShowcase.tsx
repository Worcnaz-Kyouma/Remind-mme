'use client'
import { useState } from "react"
import CompressedUser from "./CompressedUser"
import UncompressedUser from "./UncompressedUser"


export default function UserShowcase({
    user
}: {
    user:any
}) {
    const [ isCompressed, setIsCompressed ] = useState(true)

    return (
        isCompressed
            ?  
                <CompressedUser user={user} setIsCompressed={() => setIsCompressed(false)}/>
            :  
                <UncompressedUser user={user} setIsCompressed={() => setIsCompressed(true)}/>
    )
}