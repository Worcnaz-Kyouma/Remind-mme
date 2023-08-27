import UserModel from "@shared/models/UserModel"
import styles from "@/app/styles/components/Member.module.scss"
import TeamModel from "@shared/models/TeamModel"

export default function Member({
    user,
    userLevel,
    loggedUser,
    team,
    setUserShowcaseData
}: {
    user: UserModel
    userLevel: number
    loggedUser: UserModel
    team: TeamModel
    setUserShowcaseData: (userShowcaseDate:{user:UserModel, userLevel:number, loggedUser:UserModel, team:TeamModel}) => void
}) {
    return (
    <>
        <div className={styles['member-wrapper']} onClick={() => {
            setUserShowcaseData({user, userLevel, loggedUser, team})
        }}>
            <img src={`http://localhost:22194/${user.imageUrl}`} alt="Member image" />
        </div>
    </>
    )
}