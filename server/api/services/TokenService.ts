import {Token, database} from "../models/TokenModel";

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

export function getToken(value:string, isToken:boolean = true) {
    return new Promise<Token | Error>(async (resolve, reject) => {
        database.findOne(isToken ?  { token: value }  :  { userId: value } , function(err, docs) {
            if(err)
                resolve(err)

            resolve(docs)
        })
    })     
}

export function createToken(tokenJSON: Token) {
    return new Promise<Token | Error>(async (resolve, reject) => {
        database.insert(tokenJSON, function (err, newDoc) {
            if(err)
                resolve(err)

            resolve(newDoc)
        })
    })
}

export function updateToken(tokenJSON: Token) {
    return new Promise<number | Error>(async (resolve, reject) => {
        database.update({ _id: tokenJSON._id }, tokenJSON, {}, function (err, numDocs) {
            if(err)
                resolve(err)

            resolve(numDocs)
        })
    })
}


export function createOrUpdateToken(tokenJSON: Token) {
    database.count({ userId: tokenJSON.userId }, function (err, result) {
        if(err)
            return { error: "Error" }

        if (result == 0)
            return createToken(tokenJSON)
        else 
            return updateToken(tokenJSON)
    })
}