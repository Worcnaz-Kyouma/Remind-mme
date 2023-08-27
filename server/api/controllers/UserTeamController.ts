import { Request, Response } from "express"
import { UserTeam } from './../models/UserTeamModel'
import * as userTeamService from "./../services/UserTeamService"

/*Service functions
    
*/

function invalidRequest(res:Response, message="Invalid request"){
    res.status(400)
    res.json({error: message})
}

export async function getLevelSegmentsInTeamWithUsers(req:Request, res:Response) {
    if(typeof req.params.teamId === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await userTeamService.getLevelSegmentsInTeamWithUsers(req.params.teamId)

    res.status(200)
    if(data && 'error' in data)
        res.status(500)

    res.json(data)
}