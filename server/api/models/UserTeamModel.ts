import Datastore from 'nedb'

import { User } from './UserModel'
import { Team } from './TeamModel'

export type UserTeam = {
    _id?: string
    
    userId: string
    teamId: string
    level: number

    user?: User
    team?: Team

    createdAt: Date
    updatedAt: Date
}



export const databaseUserTeam = new Datastore('database/usersteams.db');
databaseUserTeam.loadDatabase()