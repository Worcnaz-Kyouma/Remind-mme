import { Request, Response } from "express"
import { Team } from './../models/TeamModel'
import * as teamService from "./../services/TeamService"

/*Service functions
    
*/

function invalidRequest(res:Response){
    res.status(400)
    res.json({error: "Invalid request"})
}

export async function createTeamByOwner(req:Request, res:Response) {
    if(typeof req.body.userId === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await teamService.createTeamByOwner(req.body.userId)

    res.status(201)
    if('error' in data)
        res.status(500)

    res.json(data)
}