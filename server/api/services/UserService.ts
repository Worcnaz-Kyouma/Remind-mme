import { User, databaseUser } from "../models/UserModel";
import { Team, databaseTeam } from "../models/TeamModel"
import { UserTeam, databaseUserTeam } from "../models/UserTeamModel"
import upload from "./../../config/multer"
import crypto from 'crypto'
import { Request, Response } from "express"
import validatorJS from "validator"
import fs from "fs"

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

async function validator(userJSON:User) {
    if(!userJSON.username)
        return {
            errorTitle: "Valitation",
            errorMessage: "Username cannot be null",
            rawError: "Username field are null"
        }
    if(!userJSON.password)
        return {
            errorTitle: "Valitation",
            errorMessage: "Password cannot be null",
            rawError: "Password field are null"
        }
    if(!userJSON.name)
        return {
            errorTitle: "Valitation",
            errorMessage: "Name cannot be null",
            rawError: "Name field are null"
        }
    if(!userJSON.email)
        return {
            errorTitle: "Valitation",
            errorMessage: "Email cannot be null",
            rawError: "Email field are null"
        }

    if(!userJSON._id && await getUserByUsername(userJSON.username))
        return {
            errorTitle: "Valitation",
            errorMessage: "Already exist an user with that username",
            rawError: "User unique duplicated"
        }
    else
        if(await getUserByUsernameIdNe(userJSON.username, userJSON._id!))
            return {
                errorTitle: "Valitation",
                errorMessage: "Already exist an user with that username",
                rawError: "User unique duplicated"
            }

    if(!validatorJS.isEmail(userJSON.email))
        return {
            errorTitle: "Valitation",
            errorMessage: "Invalid email",
            rawError: "Invalid email field"
        }
    /*if(userJSON.phone && !validatorJS.isNumeric(userJSON.phone))
        return {
            errorTitle: "Valitation",
            errorMessage: "Invalid number",
            rawError: "Invalid number field"
        }*/

    if(!validatorJS.isBefore(userJSON.bornDate, (new Date()).toISOString()))
        return {
            errorTitle: "Valitation",
            errorMessage: "Invalid date",
            rawError: "Invalid date field"
        }

    return null
}

export function createUser(req:Request, res:Response) {
    return new Promise<User | ErrorJSON>(async (resolve, reject) => {
        upload.single('image')(req, res, async function (err) {
            if (err)
                resolve (generateErrorJSON({
                    errorTitle: "Upload error",
                    errorMessage: "Error trying to save user image",
                    rawError: err
                }))

            const userJSON:User = req.body

            //Validator
            const validatorResult = await validator(userJSON)
            if(validatorResult)
                resolve(generateErrorJSON(validatorResult))

            else{
                userJSON.webToken = crypto.randomUUID()
                userJSON.imageUrl = req.file?.path || "uploads/template.png"
                userJSON.createdAt = new Date()
                userJSON.updatedAt = new Date()

                databaseUser.insert(userJSON, function (err, doc) {
                    if(err)
                        resolve(generateErrorJSON())
                    else{
                        databaseUser.loadDatabase()
                        resolve(userJSON)
                    }
                })
            }
        })
    })
}

export function updateUser(req:Request, res:Response) {
    return new Promise<User | ErrorJSON>(async (resolve, reject) => {
        upload.single('image')(req, res, async function (err) {
            if (err)
                resolve (generateErrorJSON({
                    errorTitle: "Upload error",
                    errorMessage: "Error trying to save user image",
                    rawError: err
                }))

            if(req.file?.path)
                fs.unlink(req.body.imageUrl, err => {
                    if (err) resolve(generateErrorJSON("Error trying delete old image"))
                })

            const userJSON:User & { teamId?:string, level?:string } = req.body

            if(userJSON.teamId && userJSON.level){
                databaseUserTeam.update({ 
                    userId: userJSON._id, 
                    teamId: userJSON.teamId 
                }, { $set: { 
                    level: parseInt(userJSON.level), 
                    updatedAt: new Date() 
                } }, {}, function (err, doc) {
                    if(err)
                        resolve(generateErrorJSON())
                    else{
                        databaseUserTeam.loadDatabase();
                        if(!userJSON.password){
                            userJSON.webToken=undefined
                            resolve(userJSON)
                            return
                        }
                    }
                })
                userJSON.teamId = undefined
                userJSON.level = undefined
            }

            if(userJSON.password){
                //Validator
                const validatorResult = await validator(userJSON)
                if(validatorResult)
                    resolve(generateErrorJSON(validatorResult))
                
                else{
                    userJSON.imageUrl = req.file?.path || req.body.imageUrl
                    userJSON.updatedAt = new Date()

                    databaseUser.update({ _id: userJSON._id }, userJSON, {}, function (err, doc) {
                        if(err)
                            resolve(generateErrorJSON())
                        else{
                            databaseUser.loadDatabase()
                            userJSON.webToken=undefined
                            resolve(userJSON)
                        }
                    })
                }
            }
        })
    })
}

export function getUserByUsername(username: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        databaseUser.findOne({ username: username }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())
            else
                resolve(docs)
        })
    })
}

export function getUserByUsernameIdNe(username: string, _id: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        databaseUser.findOne({_id: { $ne: _id }, username: username }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())
            else
                resolve(docs)
        })
    })
}

export function getUserGeneretingWebToken(username: string, password: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        databaseUser.findOne({ username: username, password: password }, function(err, user:User) {
            if(err){
                resolve(generateErrorJSON())
            }

            if(user){
                user.webToken = crypto.randomUUID()
                user.updatedAt = new Date()
                databaseUser.update({ _id: user._id }, { $set: user }, {}, function(err, docs) {
                    if(err){
                        resolve(generateErrorJSON())
                    }
                    else {
                        databaseUser.loadDatabase()
                        resolve(user)
                    }
                })
                
            }
            else {
                databaseUser.findOne({ username: username }, function(err, docs) {
                    if(err)
                        resolve(generateErrorJSON())
        
                    if(docs)
                        resolve(generateErrorJSON({
                            errorTitle: "Incorrect credentials",
                            errorMessage: "Incorrect password",
                            rawError: "No use found with this username/password"
                        }))

                    else
                        resolve(generateErrorJSON({
                            errorTitle: "Incorrect credentials",
                            errorMessage: "User dont exist",
                            rawError: "No user found with this username"
                        }))
                })
            }
        })
    })     
}

export function getUserByWebToken(webToken: string) {
    return new Promise<User | ErrorJSON>(async (resolve, reject) => {
        databaseUser.findOne({ webToken: webToken } , function(err, user: User) {
            if(err)
                resolve(generateErrorJSON())

            if(!user)
                resolve(generateErrorJSON({
                    errorTitle: "Cookie",
                    errorMessage: "This cookie are invalid",
                    rawError: "No user found with this webtoken"
                }))

            else
                databaseUserTeam.find({ userId: user._id }, {}, function(err, userTeams: UserTeam[]) {
                    if(err)
                        resolve(generateErrorJSON())

                    else{
                        databaseTeam.find({ _id: { $in: userTeams.map(userTeam => userTeam.teamId) }  }, {}, function(err, teams: Team[]) {
                            if(err)
                                resolve(generateErrorJSON())

                            else{
                                user.teams = teams

                                resolve(user)
                            }
                        })
                    }
                })
        })
    })
}

export function getUsersByGivenFieldOutOfTeam(limit: number, page: number, field: "name"|"email"|"phone", value: string, teamId:string) {
    return new Promise<{ users: User[], totalPages: number, currentPage: number } | ErrorJSON>(async (resolve, reject) => {
        databaseUserTeam.find({ teamId: teamId }, {}, function(err, userTeams: UserTeam[]) {
            if(err)
                resolve(generateErrorJSON())

            else
                databaseUser.find({ [field]: { $regex: RegExp(value) }, _id: { $nin: userTeams.map(userTeam => userTeam.userId) } }, {}, function(err, users: User[]) {
                    if(err)
                        resolve(generateErrorJSON(err))

                    else{
                        const result = {
                            users: users ? users.slice((page-1)*limit, (page-1)*limit+limit) : [],
                            totalPages: users ? Math.ceil(users.length/limit) : 0,
                            currentPage: page
                        }
                        resolve(result)
                    }
                })
            })
    })
}