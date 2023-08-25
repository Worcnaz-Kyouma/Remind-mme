import Datastore from 'nedb'

import { User } from './UserModel'
import { Task } from './TaskModel'

export type Group = {
    name: string

    users: User[] | undefined
    tasks: Task[] | undefined

    createdAt: Date
    updatedAt: Date
}



export const database = new Datastore('./../../database/groups.db');
database.loadDatabase()