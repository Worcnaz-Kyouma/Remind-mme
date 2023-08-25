import { Token } from "../models/TokenModel";
import { User, database } from "../models/UserModel";
import * as tokenService from "./TokenService"
import crypto from 'crypto'

function generateErrorJSON(err:any){
    const errorJSON = {
        error: {
            type: err.constructor.name,
            field: err.errors?.map((error:any) => error.path),
            message: err.parent?.sqlMessage || err.errors?.map((error:any) => error.message)
        }
    }

    return errorJSON
}

export function getUser(username: string, password: string) {
    return new Promise<User | Error>(async (resolve, reject) => {
        database.findOne({ username: username, password: password }, function(err, docs) {
            if(err)
                resolve(err)

            if(Object.entries(docs).length !== 0){
                const token = crypto.randomBytes(32).toString('hex')
                tokenService.createOrUpdateToken({ userId: docs.userId as string, token: token, createdAt: new Date(), updatedAt: new Date() } as Token)
                docs.token = token
            }
            
            resolve(docs)
        })
    })     
}