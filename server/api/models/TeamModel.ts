import Datastore from 'nedb'

import { User } from './UserModel'
import { Task } from './TaskModel'

export type Team = {
    _id?: string

    name: string

    users?: User[]
    tasks?: Task[]

    createdAt: Date
    updatedAt: Date
}



export const databaseTeam = new Datastore('database/teams.db');
databaseTeam.loadDatabase()