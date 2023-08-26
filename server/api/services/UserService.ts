import { User, database } from "../models/UserModel";
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

    console.log(userJSON)

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

            database.insert(userJSON, function (err, doc) {
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

            const userJSON:User = req.body

            //Validator
            const validatorResult = await validator(userJSON)
            if(validatorResult)
                resolve(generateErrorJSON(validatorResult.error))

            userJSON.imageUrl = req.file?.path || req.body.imageUrl
            userJSON.updatedAt = new Date()

            database.update({ _id: userJSON._id }, userJSON, {}, function (err, doc) {
                if(err)
                    resolve(generateErrorJSON())

                resolve(userJSON)
            })
        })
    })
}

export function getUserByUsername(username: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        database.findOne({ username: username }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())

            resolve(docs)
        })
    })
}

export function getUserByUsernameIdNe(username: string, _id: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        database.findOne({_id: { $ne: _id }, username: username }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())

            resolve(docs)
        })
    })
}

export function getUserGeneretingWebToken(username: string, password: string) {
    return new Promise<User | ErrorJSON >(async (resolve, reject) => {
        database.findOne({ username: username, password: password }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())

            if(Object.entries(docs).length !== 0){
                docs.webToken = crypto.randomUUID()
                docs.updatedAt = new Date()
                database.update({ _id: docs._id }, { $set: docs }, {}, function(err, docs) {
                    if(err)
                        resolve(generateErrorJSON())
                })
                resolve(docs)
            }
        })

        database.findOne({ username: username }, function(err, docs) {
            if(err)
                resolve(generateErrorJSON())

            if(Object.entries(docs).length !== 0)
                resolve(generateErrorJSON('Incorrect password'))

            resolve(generateErrorJSON('User not exist'))
        })
    })     
}

export function getUserByWebToken(webToken: string) {
    return new Promise<User | Error>(async (resolve, reject) => {
        database.findOne({ webToken: webToken } , function(err, docs) {
            if(err)
                resolve(err)

            resolve(docs)
        })
    })
}