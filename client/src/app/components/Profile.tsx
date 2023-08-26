'use client'
import { Dispatch, SetStateAction, useState } from "react"
import CompressedProfile from "./CompressedProfile"
import UserShowcase from "./UserShowcase"


export default function Profile({
    user,
}: {
    user:any,
}) {
    const [ isCompressed, setIsCompressed ] = useState(true)

    return (
        <>
        <CompressedProfile user={user} setCompressedOff={() => setIsCompressed(false)}/>
        {!isCompressed && <UserShowcase user={user} loggedUser={user} setCompressedOn={() => setIsCompressed(true)}/>}
        </>
    )
}