import UserModel from "@shared/models/UserModel"
import styles from "@/app/styles/components/SegmentTeam.module.scss"
import User from "./User"

export default function SegmentTeam({
    level,
    users
}: {
    level: string,
    users: UserModel[]
}) {
    return (
        <div className={styles.segment}>
            {users.map(user => <User key={user._id} user={user} />)}
            <span>{level}</span>
        </div>
    )
}