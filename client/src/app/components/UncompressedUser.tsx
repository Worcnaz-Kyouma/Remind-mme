import { SetStateAction } from "react";
import styles from "./../styles/components/UncompressedUser.module.scss"

export default function UncompressedUser({
    user,
    setIsCompressed
}: {
    user:any,
    setIsCompressed: (value: SetStateAction<boolean>) => void
}) {
    return (
        <div className={styles['blur-wrapper']}>
            <div className={styles['uncompressed']}>
                <button onClick={
                    () => setIsCompressed(true)
                }>Exit</button>
                {user.username}
            </div>
        </div>
    )
}