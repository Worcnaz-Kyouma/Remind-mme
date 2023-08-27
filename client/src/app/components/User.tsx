import User from "@shared/models/UserModel"
import styles from "@/app/styles/components/User.module.scss"

export default function User({
    user
}: {
    user: User
}) {
    return (
    <>
        <div className={styles['user-wrapper']}>

        </div>
    </>
    )
}