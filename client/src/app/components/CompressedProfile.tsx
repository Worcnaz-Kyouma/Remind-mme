import { SetStateAction, useState } from "react"
import styles from "./../styles/components/CompressedProfile.module.scss"
import UserModel from "@shared/models/UserModel"
import HoverData from "./HoverData"

export default function CompressedProfile({
    user,
    setCompressedOff,
}: {
    user: UserModel,
    setCompressedOff: () => void,
}) {
    const [ isHover, setIsHover ] = useState(false)

    return ( 
        <>
        <div className={styles['member-wrapper']}>
            {isHover && <HoverData user={user} inLeft={false} isProfile={true}/>}
            <div className={styles['image-wrapper']} onMouseEnter={() => {
                setIsHover(true)
            }} onMouseLeave={() => {
                setIsHover(false)
            }} onClick={setCompressedOff} title="Show/Change user data">
                <img src={`http://localhost:22194/${user.imageUrl}`} alt="Member image" />
            </div>
        </div>
    </>
    )
}