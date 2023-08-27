import User from './UserModel'
import Team from './TeamModel'

type UserTeam = {
    _id?: string
    
    userId: string
    teamId: string
    level: number

    user?: User
    team?: Team

    createdAt: string
    updatedAt: string
}

export default UserTeam