import { UserTeam, databaseUserTeam } from "../models/UserTeamModel"
import { Request, Response } from "express"
import validatorJS from "validator"
import { User, databaseUser } from "../models/UserModel"

type ErrorJSON = {
    errorTitle:string
    errorMessage:string
    rawError:any
}

function generateErrorJSON(err:ErrorJSON | any = 'Server internal error'){
    if('errorTitle' in err && 'errorMessage' in err && 'rawError' in err){
        const errorJSON:ErrorJSON = {
            errorTitle: err.errorTitle as string,
            errorMessage: err.errorMessage as string,
            rawError: err.errorMessage
        }
        return errorJSON
    }
    
    const errorJSON:ErrorJSON = {
        errorTitle: "Error",
        errorMessage: "Internal Error",
        rawError: err
    }

    return errorJSON
}

export function getLevelSegmentsInTeamWithUsers(teamId:string) {
    return new Promise<{ level: number, users: User[] }[] | ErrorJSON>(async (resolve, reject) => {
        databaseUserTeam.find({ teamId: teamId }).sort({ userId: 1 }).exec(function (err, usersTeams: UserTeam[]) {
            if(err)
                resolve(generateErrorJSON())

            if(!usersTeams)
                resolve(generateErrorJSON({
                    errorTitle: "Internal error",
                    errorMessage: "Group dont have any member",
                    message: "No use found with this teamId"
                }))

            else
                databaseUser.find({ _id: { $in: usersTeams.map(userTeam => userTeam.userId) } }).sort({ _id: 1 }).exec(function (err, users:User[]) {
                    if(err)
                        resolve(generateErrorJSON())

                    if(!users)
                        resolve(generateErrorJSON({
                            errorTitle: "Internal error",
                            errorMessage: "Group dont have any member",
                            message: "No use found with this teamId"
                        }))

                    if(users.length != usersTeams.length)
                        resolve(generateErrorJSON())

                    else{
                        let results:{ level: number, users: User[] }[] = []
                        usersTeams.forEach((userTeam, index) => {
                            if(typeof results[userTeam.level] === 'undefined'){
                                users[index].password=''
                                users[index].webToken=undefined
                                results[userTeam.level] = { level: userTeam.level, users: [users[index]] }
                            }
                            else{
                                users[index].password=''
                                users[index].webToken=undefined
                                results[userTeam.level].level = userTeam.level
                                results[userTeam.level].users.push(users[index])
                            }
                        })

                        results = results!.filter(result => result != null).sort((a, b) => b.level - a.level)

                        resolve(results)
                    }
                })
        })
    })
}

export function getUserAndMaxLevelInGroup(userId:string, teamId:string) {
    return new Promise<{ loggedUserLevel:number, maxLevel:number } | ErrorJSON>(async (resolve, reject) => {
        databaseUserTeam.findOne({ userId: userId, teamId:teamId }, function (err, userTeam:UserTeam) {
            if(err)
                resolve(generateErrorJSON())

            if(!userTeam)
                resolve(generateErrorJSON({
                    errorTitle: "Internal error",
                    errorMessage: "User / Team relationship not found",
                    message: "No user found with this user/team"
                }))
                

            else
                databaseUserTeam.find({ teamId: teamId }).sort({ level: -1 }).exec(function (err, maxLevel:UserTeam[]) {
                    if(err)
                        resolve(generateErrorJSON())
                        
                    if(!maxLevel)
                        resolve(generateErrorJSON({
                            errorTitle: "Internal error",
                            errorMessage: "Not found User / Team relationship not found",
                            message: "No user found with this user/team"
                        }))
                        
                    else
                        resolve({ loggedUserLevel:userTeam.level, maxLevel:maxLevel[0].level })
                })
        })
    })
}

export function createUserTeamRelation(userId: string, teamId: string, level:number) {
    return new Promise<UserTeam | ErrorJSON>(async (resolve, reject) => {
        const newUserTeam:UserTeam = {userId: userId, teamId: teamId, level: level, createdAt: new Date(), updatedAt: new Date()}
        databaseUserTeam.insert(newUserTeam, function(err, doc) {
            if(err)
                resolve(generateErrorJSON())

            else
                resolve(doc)
        })
    })
}

export function deleteUserTeamRelation(userId:string, teamId:string){
    return new Promise<{ status:string } | ErrorJSON>(async (resolve, reject) => {
        databaseUserTeam.remove({ userId:userId, teamId: teamId }, {}, function (err, numRemoved) {
            if(err)
                resolve(generateErrorJSON())

            else
                resolve({ status: 'Success' })
        })
    })
}