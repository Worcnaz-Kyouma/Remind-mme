import UserModel from "@shared/models/UserModel"
import styles from "@/app/styles/components/SegmentTeam.module.scss"
import Member from "./Member"

export default function SegmentTeam({
    level,
    users,
    loggedUser,
    setUserShowcaseData
}: {
    level: number,
    users: UserModel[],
    loggedUser: UserModel,
    setUserShowcaseData: (user:UserModel, userLevel:number, loggedUser:UserModel) => void
}) {
    return (
        <div className={styles.segment}>
            {users.map(user => <Member key={user._id} user={user} userLevel={level} loggedUser={loggedUser} setUserShowcaseData={setUserShowcaseData}/>)}
            <span>{level}</span>
        </div>
    )
}