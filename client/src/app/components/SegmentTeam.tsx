import UserModel from "@shared/models/UserModel"
import styles from "@/app/styles/components/SegmentTeam.module.scss"
import Member from "./Member"
import TeamModel from "@shared/models/TeamModel"
import { useRef } from "react"

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
    const segmentDivDOMRef = useRef<HTMLDivElement | null>(null)

    return (
        <div className={styles.segment} ref={segmentDivDOMRef}>
            {users.map(user => <Member key={user._id} user={user} userLevel={level} loggedUser={loggedUser} loggedUserLevel={loggedUserLevel} maxTeamLevel={maxTeamLevel} team={team} setUserShowcaseData={setUserShowcaseData} segmentWrapperRef={segmentDivDOMRef}/>)}
            <span>{level}</span>
        </div>
    )
}