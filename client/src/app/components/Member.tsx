import UserModel from "@shared/models/UserModel"
import styles from "@/app/styles/components/Member.module.scss"
import { useState } from "react"
import UserShowcase from "./UserShowcase"

export default function Member({
    user,
    userLevel,
    loggedUser,
    setUserShowcaseData
}: {
    user: UserModel
    userLevel: number
    loggedUser: UserModel
    setUserShowcaseData: (user:UserModel, userLevel:number, loggedUser:UserModel) => void
}) {
    return (
    <>
        <div className={styles['member-wrapper']} onClick={() => {
            setUserShowcaseData(user, userLevel, loggedUser)
        }}>
            <img src={`http://localhost:22194/${user.imageUrl}`} alt="Member image" />
        </div>
    </>
    )
}