import UserModel from "@shared/models/UserModel"
import styles from "@/app/styles/components/Member.module.scss"
import TeamModel from "@shared/models/TeamModel"

export default function Member({
    user,
    userLevel,
    loggedUser,
    loggedUserLevel,
    maxTeamLevel,
    team,
    setUserShowcaseData
}: {
    user: UserModel
    userLevel: number
    loggedUser: UserModel
    loggedUserLevel: number
    maxTeamLevel: number
    team: TeamModel
    setUserShowcaseData: (userShowcaseDate:{user:UserModel, userLevel:number, loggedUser:UserModel, loggedUserLevel:number, maxTeamLevel:number, team:TeamModel}) => void
}) {
    return (
    <>
        <div className={styles['member-wrapper']} onClick={() => {
            setUserShowcaseData({user, userLevel, loggedUser, loggedUserLevel, maxTeamLevel, team})
        }}>
            <img src={`http://localhost:22194/${user.imageUrl}`} alt="Member image" />
        </div>
    </>
    )
}