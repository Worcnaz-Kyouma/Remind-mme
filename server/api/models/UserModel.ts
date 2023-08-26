import Datastore from 'nedb'
import { Group } from './GroupModel'
import { Task } from './TaskModel'

export type User = {
    _id: string| null
    webToken: string | null

    username: string
    password: string
    name: string
    email: string
    phone: string | null
    imageUrl: string
    bornDate: string

    groups: Group[] | undefined
    tasks: Task[] | undefined

    createdAt: Date
    updatedAt: Date
}



export const database = new Datastore('database/users.db');
database.loadDatabase()