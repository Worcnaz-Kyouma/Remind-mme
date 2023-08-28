import UserModel from "@shared/models/UserModel"
import styles from "@/app/styles/components/SegmentTeam.module.scss"
import Member from "./Member"
import TeamModel from "@shared/models/TeamModel"

export default function SegmentTeam({
    level,
    users,
    loggedUser,
    loggedUserLevel,
    maxTeamLevel,
    team,
    setUserShowcaseData
}: {
    level: number
    users: UserModel[]
    loggedUser: UserModel
    loggedUserLevel: number
    maxTeamLevel: number
    team: TeamModel
    setUserShowcaseData: (userShowcaseDate:{user:UserModel, userLevel:number, loggedUser:UserModel, loggedUserLevel:number, maxTeamLevel:number, team:TeamModel}) => void
}) {
    return (
        <div className={styles.segment}>
            {users.map(user => <Member key={user._id} user={user} userLevel={level} loggedUser={loggedUser} loggedUserLevel={loggedUserLevel} maxTeamLevel={maxTeamLevel} team={team} setUserShowcaseData={setUserShowcaseData}/>)}
            <span>{level}</span>
        </div>
    )
}