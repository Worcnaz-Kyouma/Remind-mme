import User from './UserModel'
import Task from './TaskModel'

type Team = {
    _id?: string

    name: string

    users?: User[]
    tasks?: Task[]

    createdAt: string
    updatedAt: string
}

export default Team
