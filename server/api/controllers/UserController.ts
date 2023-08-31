import { Request, Response, json } from "express"
import { User } from './../models/UserModel'
import * as userService from "./../services/UserService"

/*Service functions
    
*/

function invalidRequest(res:Response, message="Invalid request"){
    res.status(400)
    res.json({error: message})
}

export async function createUser(req:Request, res:Response) {
    const data = await userService.createUser(req, res)

    res.status(201)
    if('rawError' in data)
        res.status(500)
    else{
        res.cookie('SESSIONRMM', data.webToken);
    }
    
    res.json(data)
}

export async function updateUser(req:Request, res:Response) {
    const data = await userService.updateUser(req, res)

    res.status(201)
    if(typeof data !== 'number' && 'rawError' in data)
        res.status(500)
    
    res.json(data)
}

export async function getUserByUsername(req:Request, res:Response) {
    if(typeof req.params.username === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await userService.getUserByUsername(req.params.username)

    res.status(200)
    if(data && 'rawError' in data)
        res.status(500)

    res.json(data)
}

export async function getUserByWebToken(req:Request, res:Response) {
    if(typeof req.cookies.SESSIONRMM === 'undefined'){
        res.status(400)
        res.json({
            errorTitle: "Cookie",
            errorMessage: "This cookie are invalid",
            rawError: "No user found with this webtoken"
        })
        return
    }

    const data = await userService.getUserByWebToken(req.cookies.SESSIONRMM)

    res.status(200)
    if(data && 'rawError' in data)
        res.status(500)
    res.json(data)
}

export async function getUserGeneretingCookie(req:Request, res:Response) {
    if(typeof req.body.username === "undefined" && typeof req.body.password === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await userService.getUserGeneretingWebToken(req.body.username, req.body.password);
        
    res.status(200)
    if(data && 'rawError' in data){
        res.status(500)
    }
    else{
        res.cookie('SESSIONRMM', data.webToken); 
    }

    res.json(data)
}

export async function getUsersByGivenFieldOutOfTeam(req:Request, res:Response) {
    if(
        typeof req.query.limit === "undefined" && 
        typeof req.query.page === "undefined"  &&
        typeof req.query.field === "undefined"  &&
        typeof req.query.value === "undefined"  &&
        typeof req.query.teamId === "undefined" 
    ){
        invalidRequest(res)
        return
    }

    const data = await userService.getUsersByGivenFieldOutOfTeam(
        parseInt(req.query.limit as string), 
        parseInt(req.query.page as string), 
        req.query.field as "name"|"email"|"phone", 
        req.query.value as string,
        req.query!.teamId as string
    )

    res.status(200)
    if(data && 'rawError' in data)
        res.status(500)

    res.json(data)
}