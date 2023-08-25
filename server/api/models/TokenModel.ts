import Datastore from 'nedb'

import { User } from './UserModel'

export type Token = {
    _id: string | null

    userId: string

    token: string

    user: User | undefined

    createdAt: Date
    updatedAt: Date
}

export const database = new Datastore('database/tokens.db');
database.loadDatabase()