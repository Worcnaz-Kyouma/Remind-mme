import { Request, Response } from "express"
import { User } from './../models/UserModel'
import * as userService from "./../services/UserService"

/*Service functions
    
*/

function invalidRequest(res:Response){
    res.status(400)
    res.json({error: "Invalid request"})
}

export async function createUser(req:Request, res:Response) {
    const data = await userService.createUser(req, res)

    res.status(201)
    if('error' in data)
        res.status(500)
    else{
        res.cookie('SESSIONRMM', data.webToken);
    }
    
    res.json(data)
}

export async function updateUser(req:Request, res:Response) {
    const data = await userService.updateUser(req, res)

    res.status(201)
    if('error' in data)
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
    if(data && 'error' in data)
        res.status(500)

    res.json(data)
}

export async function getUserByWebToken(req:Request, res:Response) {
    if(typeof req.cookies.SESSIONRMM === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await userService.getUserByWebToken(req.cookies.SESSIONRMM)

    res.status(200)
    if(data && 'error' in data)
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
    if(data && 'error' in data){
        res.status(500)
    }
    else{
        res.cookie('SESSIONRMM', data.webToken); 
    }

    res.json(data)
}