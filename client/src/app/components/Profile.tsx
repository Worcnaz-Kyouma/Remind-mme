'use client'
import { Dispatch, SetStateAction, useState } from "react"
import CompressedProfile from "./CompressedProfile"
import UserShowcase from "./UserShowcase"
import UserModel from "@shared/models/UserModel"


export default function Profile({
    user,
}: {
    user: UserModel,
}) {
    const [ isCompressed, setIsCompressed ] = useState(true)

    return (
        <>
        <CompressedProfile user={user} setCompressedOff={() => setIsCompressed(false)}/>
        {!isCompressed && <UserShowcase user={user} loggedUser={user} setCompressedOn={() => setIsCompressed(true)}/>}
        </>
    )
}