import Team from './TeamModel'
import Task from './TaskModel'

type User = {
    _id?: string
    webToken?: string

    username: string
    password: string
    name: string
    email: string
    phone?: string
    imageUrl: string
    bornDate: string

    teams?: Team[]
    tasks?: Task[]

    createdAt: string
    updatedAt: string
}

export default User