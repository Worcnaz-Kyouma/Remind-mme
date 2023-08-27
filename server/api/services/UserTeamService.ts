import { UserTeam, databaseUserTeam } from "../models/UserTeamModel"
import { Request, Response } from "express"
import validatorJS from "validator"
import { User, databaseUser } from "../models/UserModel"

type ErrorJSON = {
    error:any
}

function generateErrorJSON(err:any = 'Server internal error'){
    const errorJSON:ErrorJSON = {
        error: { err }
    }

    return errorJSON
}

export function getLevelSegmentsInTeamWithUsers(teamId:string) {
    return new Promise<{ level: number, users: User[] }[] | ErrorJSON>(async (resolve, reject) => {
        databaseUserTeam.find({ teamId: teamId }).sort({ userId: 1 }).exec(function (err, usersTeams: UserTeam[]) {
            if(err)
                return generateErrorJSON()

            if(!usersTeams)
                return generateErrorJSON("group don't have any member")

            databaseUser.find({ _id: { $in: usersTeams.map(userTeam => userTeam.userId) } }).sort({ _id: 1 }).exec(function (err, users:User[]) {
                if(err)
                    return generateErrorJSON()

                if(!users)
                    return generateErrorJSON("group don't have any member")

                if(users.length != usersTeams.length)
                    return generateErrorJSON()

                let results:{ level: number, users: User[] }[]
                usersTeams.forEach((userTeam, index) => {
                    results[userTeam.level].level = userTeam.level
                    results[userTeam.level].users.push(users[index])
                })

                results = results!.filter(result => result != null).sort((a, b) => a.level - b.level)

                resolve(results)
            })
        })
    })
}