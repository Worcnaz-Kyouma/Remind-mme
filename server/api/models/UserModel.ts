import Datastore from 'nedb'
import { Team } from './TeamModel'
import { Task } from './TaskModel'

export type User = {
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

    createdAt: Date
    updatedAt: Date
}



export const databaseUser = new Datastore('database/users.db');
databaseUser.loadDatabase()