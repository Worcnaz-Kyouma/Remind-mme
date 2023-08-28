import { User, databaseUser } from "../models/UserModel";
import { Team, databaseTeam } from "../models/TeamModel"
import { UserTeam, databaseUserTeam } from "../models/UserTeamModel"
import upload from "./../../config/multer"
import crypto from 'crypto'
import { Request, Response } from "express"
import validatorJS from "validator"
import fs from "fs"

type ErrorJSON = {
    error:any
}

function generateErrorJSON(err:any = 'Server internal error'){
    const errorJSON:ErrorJSON = {
        error: { err }
    }

    return errorJSON
}

async function validator(userJSON:User) {
    if(!userJSON.username)
        return { error: "Username cannot be null" }
    if(!userJSON.password)
        return { error: "Password cannot be null" }
    if(!userJSON.name)
        return { error: "Name cannot be null" }
    if(!userJSON.email)
        return { error: "Email cannot be null" }

    if(!userJSON._id && await getUserByUsername(userJSON.username))
        return { error: "Already exist an user with that username" }
    else
        if(await getUserByUsernameIdNe(userJSON.username, userJSON._id!))
            return { error: "Already exist an user with that username" } 

    if(!validatorJS.isEmail(userJSON.email))
        return { error: "Invalid email" }
    if(userJSON.phone && !validatorJS.isNumeric(userJSON.phone))
        return { error: "Invalid number" }

    if(!validatorJS.isBefore(userJSON.bornDate, (new Date()).toISOString()))
        return { error: "Invalid date" }

    return null
}

export function createUser(req:Request, res:Response) {
    return new Promise<User | ErrorJSON>(async (resolve, reject) => {
        upload.single('image')(req, res, async function (err) {
            if (err)
                resolve (generateErrorJSON({
                    type: "Upload error",
                    field: ["image"],
                    message: "Error in the process of image upload"
                }))

            const userJSON:User = req.body

            //Validator
            const validatorResult = await validator(userJSON)
            if(validatorResult)
                resolve(generateErrorJSON(validatorResult.error))

            userJSON.webToken = crypto.randomUUID()
            userJSON.imageUrl = req.file?.path || "uploads/template.png"
            userJSON.createdAt = new Date()
            userJSON.updatedAt = new Date()

            databaseUser.insert(userJSON, function (err, doc) {
                if(err)
                    resolve(generateErrorJSON())

                resolve(userJSON)
            })
        })
    })
}

export function updateUser(req:Request, res:Response) {
    return new Promise<User | ErrorJSON>(async (resolve, reject) => {
        upload.single('image')(req, res, async function (err) {
            if (err)
                resolve (generateErrorJSON({
                    type: "Upload error",
                    field: ["image"],
                    message: "Error in the process of image upload"
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
                    databaseUserTeam.loadDatabase();
                    if(!userJSON.password)
                        resolve(userJSON)
                })
                userJSON.teamId = undefined
                userJSON.level = undefined
            }

            if(userJSON.password){
                //Validator
                const validatorResult = await validator(userJSON)
                if(validatorResult)
                    resolve(generateErrorJSON(validatorResult.error))

                userJSON.imageUrl = req.file?.path || req.body.imageUrl
                userJSON.updatedAt = new Date()

                databaseUser.update({ _id: userJSON._id }, userJSON, {}, function (err, doc) {
                    if(err)
                        resolve(generateErrorJSON())
                    databaseUser.loadDatabase()
                    resolve(userJSON)
                })
            }
        })
    })
}

export function getUserByUsername(username: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        databaseUser.findOne({ username: username }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())

            resolve(docs)
        })
    })
}

export function getUserByUsernameIdNe(username: string, _id: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        databaseUser.findOne({_id: { $ne: _id }, username: username }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())

            resolve(docs)
        })
    })
}

export function getUserGeneretingWebToken(username: string, password: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        databaseUser.findOne({ username: username, password: password }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())

            if(docs){
                docs.webToken = crypto.randomUUID()
                docs.updatedAt = new Date()
                databaseUser.update({ _id: docs._id }, { $set: docs }, {}, function(err, docs) {
                    if(err)
                        resolve(generateErrorJSON())
                })
                databaseUser.loadDatabase()
                resolve(docs)
            }
        })

        databaseUser.findOne({ username: username }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())

            if(docs)
                resolve(generateErrorJSON('Incorrect password'))

            resolve(generateErrorJSON('User not exist'))
        })
    })     
}

export function getUserByWebToken(webToken: string) {
    return new Promise<User | ErrorJSON>(async (resolve, reject) => {
        databaseUser.findOne({ webToken: webToken } , function(err, user: User) {
            if(err)
                resolve(generateErrorJSON())

            if(!user)
                resolve(generateErrorJSON())
            else
                databaseUserTeam.find({ userId: user._id }, {}, function(err, userTeams: UserTeam[]) {
                    if(err)
                        resolve(generateErrorJSON())

                    databaseTeam.find({ _id: { $in: userTeams.map(userTeam => userTeam.teamId) }  }, {}, function(err, teams: Team[]) {
                        if(err)
                            resolve(generateErrorJSON())

                        user.teams = teams

                        resolve(user)
                    })
                })
        })
    })
}

export function getUsersByGivenFieldOutOfTeam(limit: number, page: number, field: "name"|"email"|"phone", value: string, teamId:string) {
    return new Promise<{ users: User[], totalPages: number, currentPage: number } | ErrorJSON>(async (resolve, reject) => {
        databaseUserTeam.find({ teamId: teamId }, {}, function(err, userTeams: UserTeam[]) {
            if(err)
                resolve(generateErrorJSON())

            databaseUser.find({ [field]: { $regex: RegExp(value) }, _id: { $nin: userTeams.map(userTeam => userTeam.userId) } }, {}, function(err, users: User[]) {
                if(err)
                    resolve(generateErrorJSON(err.message))

                const result = {
                    users: users ? users.slice((page-1)*limit, (page-1)*limit+limit) : [],
                    totalPages: users ? Math.ceil(users.length/limit) : 0,
                    currentPage: page
                }

                resolve(result)
            })
        })
    })
}