import { SetStateAction, useState } from "react"
import styles from "./../styles/components/CompressedProfile.module.scss"

export default function CompressedProfile({
    user,
    setCompressedOff,
}: {
    user:any,
    setCompressedOff: () => void,
}) {
    const [ isHover, setIsHover ] = useState(false)

    return ( 
        <div className={`${styles['wrapper']}`} onClick={() => {setCompressedOff()}} onMouseEnter={() => {
            setIsHover(true)
        }} onMouseLeave={() => {
            setIsHover(false)
        }}>
            {isHover && 
                <div className={styles['hover-data-wrapper']}>
                    <p>Name: {user.name}</p>
                    <p>{user.email
                        ?   `Email: ${user.email}`
                        :   `Number: ${user.number}`
                        }
                    </p>
                </div>
            }
            <div className={`${styles['image-wrapper']}`}>
                <img src={`http://localhost:22194/${user.imageUrl}`} alt="User image" />
            </div>
        </div>
    )
}