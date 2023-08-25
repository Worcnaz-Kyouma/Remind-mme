import Datastore from 'nedb'

import { User } from './UserModel'

export type Token = {
    userId: string

    token: string

    user: User | undefined

    createdAt: Date
    updatedAt: Date
}

export const database = new Datastore('./../../database/tokens.db');
database.loadDatabase()