import User from './UserModel'
import Team from './TeamModel'
 
type Task = {
    _id?: string

    userId: string
    groupId: string

    finalDate?: Date
    name: string
    description?: string
    importance?: number
    isCompleted: boolean

    user?: User
    team?: Team

    createdAt: string
    updatedAt: string
}

export default Task