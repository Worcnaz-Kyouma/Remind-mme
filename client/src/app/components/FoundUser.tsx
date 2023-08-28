import Team from "@shared/models/TeamModel"
import User from "@shared/models/UserModel"

import styles from "@/app/styles/components/FoundUser.module.scss"

export default function FoundUser({
    user,
    team,
    level
}: {
    user: User
    team: string
    level: string | undefined
}) {
    return (
        <div className={styles['found-user-wrapper']}>
            <div className={styles['img-wrapper']}>
                <img src={`http://localhost:22194/${user.imageUrl}`} alt="User found image" />
            </div>
            <div className={styles['data-wrapper']} >
                <p>Name: {user.username}</p>
                <p>Email: {user.email}</p>
                {user.phone && <p>Phone: {user.phone}</p>}
            </div>
        </div>
    )
}