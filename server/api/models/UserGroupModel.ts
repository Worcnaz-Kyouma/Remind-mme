import Datastore from 'nedb'

import { User } from './UserModel'
import { Group } from './GroupModel'

export type UserGroup = {
    userId: string
    groupId: string
    level: number

    user: User | undefined
    group: Group | undefined

    createdAt: Date
    updatedAt: Date
}



export const database = new Datastore('./../../database/usersgroups.db');
database.loadDatabase()