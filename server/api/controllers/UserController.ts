import { Request, Response } from "express"
import { User } from './../models/UserModel'
import * as userService from "./../services/UserService"

/*Service functions
    bondService.getBond
*/

function invalidRequest(res:Response){
    res.status(400)
    res.json({error: "Invalid request"})
}

export async function getUser(req:Request, res:Response) {
    if(typeof req.body.username === "undefined" && typeof req.body.password === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await userService.getUser(req.body.username, req.body.password);

    if(Object.entries(data).length === 0){
        res.status(200)
        res.json({ error: "User not found" })
    }

    if(data instanceof Error){
        res.status(500)
        res.json({ error: "Error" })
        return
    }
        
    res.cookie('SESSIONRMM', data.token, {expires: new Date(Date.now() + 360000) }); 
    res.status(200)
    /*if(data !== null && 'error' in data)
        res.status(getHttpErrorStatusCode(data))*/

    res.json(data)
}