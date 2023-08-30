import UserModel from "@shared/models/UserModel";
import styles from "@/app/styles/components/HoverData.module.scss"

export default function HoverData({
    user,
    inLeft
}: {
    user:UserModel
    inLeft:boolean
}) {
    return (
        <div className={`${styles['hover-wrapper']} ${!inLeft ? styles['left'] : ""}`}>
            <p>Name: {user.name}</p>
            <p>{user.email
                ?   `Email: ${user.email}`
                :   `Number: ${user.phone}`
                }
            </p>
        </div>
    )
}