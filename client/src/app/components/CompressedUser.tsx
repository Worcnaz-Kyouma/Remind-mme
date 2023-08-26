import { SetStateAction } from "react"
import styles from "./../styles/components/CompressedUser.module.scss"

export default function CompressedUser({
    user,
    setIsCompressed
}: {
    user:any,
    setIsCompressed: (value: SetStateAction<boolean>) => void
}) {
    return ( 
        <div className={styles['compressed']} onClick={setIsCompressed}>
            {user.username}
        </div> 
    )
}