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
            errorTitle: "Validation",
            errorMessage: "Username cannot be null",
            rawError: "Username field are null"
        }
    if(!userJSON._id && !userJSON.password)
        return {
            errorTitle: "Validation",
            errorMessage: "Password cannot be null",
            rawError: "Password field are null"
        }
    if(!userJSON.name)
        return {
            errorTitle: "Validation",
            errorMessage: "Name cannot be null",
            rawError: "Name field are null"
        }
    if(!userJSON.email)
        return {
            errorTitle: "Validation",
            errorMessage: "Email cannot be null",
            rawError: "Email field are null"
        }

    if(!userJSON._id && await getUserByUsername(userJSON.username))
        return {
            errorTitle: "Validation",
            errorMessage: "Username already in use",
            rawError: "User unique duplicated"
        }
    else
        if(await getUserByUsernameIdNe(userJSON.username, userJSON._id!))
            return {
                errorTitle: "Validation",
                errorMessage: "Username already in use",
                rawError: "User unique duplicated"
            }

    if(!validatorJS.isEmail(userJSON.email))
        return {
            errorTitle: "Validation",
            errorMessage: "Invalid email",
            rawError: "Invalid email field"
        }
    /*if(userJSON.phone && !validatorJS.isNumeric(userJSON.phone))
        return {
            errorTitle: "Validation",
            errorMessage: "Invalid number",
            rawError: "Invalid number field"
        }*/

    if(!validatorJS.isBefore(userJSON.bornDate, (new Date()).toISOString()))
        return {
            errorTitle: "Validation",
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
                userJSON.imageUrl = req.file?.path || "uploads/template.jpg"
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
    return new Promise<number | ErrorJSON>(async (resolve, reject) => {
        upload.single('image')(req, res, async function (err) {
            if (err)
                resolve (generateErrorJSON({
                    errorTitle: "Upload error",
                    errorMessage: "Invalid Image",
                    rawError: err
                }))

            if(req.file?.path && !req.body.imageUrl.includes('template.jpg'))
                fs.unlink(req.body.imageUrl, err => {
                    if (err) resolve(generateErrorJSON("Error trying delete old image"))
                })

            const userJSON:User = req.body

            //Validator
            const validatorResult = await validator(userJSON)
            if(validatorResult)
                resolve(generateErrorJSON(validatorResult))
            
            else{
                userJSON.imageUrl = req.file?.path || userJSON.imageUrl
                userJSON.updatedAt = new Date()

                databaseUser.update({ _id: userJSON._id }, { $set: userJSON }, {}, function (err, doc) {
                    if(err)
                        resolve(generateErrorJSON())
                    else{
                        databaseUser.loadDatabase()
                        resolve(doc)
                    }
                })
            }
        })
    })
}

export function updateUserPassword(userId:string, currentPassword:string, newPassword:string) {
    return new Promise<number | ErrorJSON>(async (resolve, reject) => {
        databaseUser.findOne({ _id: userId }, function(err, user:User) {
            if(err)
                resolve(generateErrorJSON())
            if(!user)
                resolve(generateErrorJSON({
                    errorTitle: "Internal error",
                    errorMessage: "User does not exist",
                    rawError: "Dont exist a user with this username"
                }))
            else{
                if(user.password != currentPassword)
                    resolve(generateErrorJSON({
                        errorTitle: "Incorrect credentials",
                        errorMessage: "Incorrect password",
                        rawError: "No user found with this username/password"
                    }))
                else{
                    user.password = newPassword
                    user.updatedAt = new Date()
                    databaseUser.update({ _id: user._id }, user, {}, function(err, num) {
                        if(err)
                            resolve(generateErrorJSON())
                        else{
                            databaseUser.loadDatabase()
                            resolve(num)
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
                            rawError: "No user found with this username/password"
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

            else{
                if(field==='phone'){
                    value = value.replace('(', '\\(').replace(')','\\)')
                }
                databaseUser.find({ [field]: { $regex: RegExp(value) }, _id: { $nin: userTeams.map(userTeam => userTeam.userId) } }, {}, function(err, users: User[]) {
                    if(err)
                        resolve(generateErrorJSON(err))

                    else{
                        const result = {
                            users: users ? users.map((user) => {
                                user.password=''
                                user.webToken=undefined
                                return user
                            }).slice((page-1)*limit, (page-1)*limit+limit) : [],
                            totalPages: users ? Math.ceil(users.length/limit) : 0,
                            currentPage: page
                        }
                        resolve(result)
                    }
                })
            }
            })
    })
}