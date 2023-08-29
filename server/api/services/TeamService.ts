import { Team, databaseTeam } from "../models/TeamModel"
import { UserTeam, databaseUserTeam } from "../models/UserTeamModel"
import { Request, Response } from "express"
import validatorJS from "validator"

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

async function validateName(teamName:string) {
    if(!teamName)
        return {
            errorTitle: "Valitation",
            errorMessage: "Team name cannot be null",
            rawError: "Name field are null"
        }

    if(teamName!='Place Holder' && await getTeamByName(teamName))
        return {
            errorTitle: "Valitation",
            errorMessage: "Already exist an team with this name",
            rawError: "Team name unique duplicated"
        }
}

export function createTeamByOwner(userId:string){
    return new Promise<Team | ErrorJSON>(async (resolve, reject) => {
        const team:Team = { name: "Place Holder", createdAt: new Date(), updatedAt: new Date() }
        databaseTeam.insert(team, function(err, team:Team) {
            if(err)
                resolve(generateErrorJSON())

            else{
                const userTeam:UserTeam = { userId: userId, teamId: team._id as string,  level: 1, createdAt: new Date(), updatedAt: new Date() }
                databaseUserTeam.insert(userTeam, function(err, userTeam:UserTeam) {
                    if(err)
                        resolve(generateErrorJSON())
                    else
                        resolve(team)
                })
            }
        })
    })
}

export function getTeamByName(name: string) {
    return new Promise<Team | ErrorJSON >(async (resolve, reject) => {
        databaseTeam.findOne({ name: name }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())
            else
                resolve(docs)
        })
    })
}

export function updateTeamName(teamId:string, teamName:string){
    return new Promise<string | ErrorJSON>(async (resolve, reject) => {
        if(teamName=='Place Holder')
            resolve(teamName)
        else {
            const validatorResult = await validateName(teamName)
            if(validatorResult)
                resolve(generateErrorJSON(validatorResult))
            else
                databaseTeam.update({ _id: teamId }, { $set: { name:teamName, updatedAt: new Date() } }, {}, function(err, num) {
                    if(err)
                        resolve(generateErrorJSON())
                    else
                        resolve(teamName)
                })
        }
    })
}

export function deleteTeamAndRelations(teamId:string){
    return new Promise<{ status:string } | ErrorJSON>(async (resolve, reject) => {
        databaseTeam.remove({ _id: teamId }, {}, function (err, numRemoved) {
            if(err)
                resolve(generateErrorJSON())
            else
                databaseUserTeam.remove({ teamId: teamId }, {}, function (err, numRemoved) {
                    if(err)
                        resolve(generateErrorJSON())
                    else
                        resolve({ status: 'Success' })
                })
        })
    })
}