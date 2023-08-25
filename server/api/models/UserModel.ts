import Datastore from 'nedb'

import { Group } from './GroupModel'
import { Task } from './TaskModel'
import { Token } from './TokenModel'

export type User = {
    _id: string| null

    username: string
    password: string
    name: string
    email: string
    phone: string
    imageUrl: string

    groups: Group[] | undefined
    tasks: Task[] | undefined
    token: Token | undefined

    createdAt: Date
    updatedAt: Date
}



export const database = new Datastore('database/users.db');
database.loadDatabase()