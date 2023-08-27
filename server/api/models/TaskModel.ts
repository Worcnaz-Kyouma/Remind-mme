import Datastore from 'nedb'

import { User } from './UserModel'
import { Team } from './TeamModel'
 
export type Task = {
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

    createdAt: Date
    updatedAt: Date
}



export const databaseTask = new Datastore('database/tasks.db');
databaseTask.loadDatabase()