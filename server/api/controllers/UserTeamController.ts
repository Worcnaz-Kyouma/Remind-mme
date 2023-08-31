import { Request, Response } from "express"
import { UserTeam } from './../models/UserTeamModel'
import * as userTeamService from "./../services/UserTeamService"

/*Service functions
    
*/

function invalidRequest(res:Response, message="Invalid request"){
    res.status(400)
    res.json({error: message})
}

export async function updateUserTeamLevel(req:Request, res:Response) {
    if(
        typeof req.query.userId === "undefined" && 
        typeof req.query.teamId === "undefined"  &&
        typeof req.body.level === "undefined"
    ){
        invalidRequest(res)
        return
    }

    const data = await userTeamService.updateUserTeamLevel(req.query.userId as string, req.query.teamId as string, parseInt(req.body.level))

    res.status(200)
    if(typeof data !== 'number' && 'rawError' in data)
        res.status(500)

    res.json(data)
}

export async function createUserTeamRelation(req:Request, res:Response) {
    if(
        typeof req.body.userId === "undefined" && 
        typeof req.body.teamId === "undefined"  &&
        typeof req.body.level === "undefined"
    ){
        invalidRequest(res)
        return
    }

    const data = await userTeamService.createUserTeamRelation(req.body.userId, req.body.teamId, parseInt(req.body.level as string))

    res.status(201)
    if(data && 'rawError' in data)
        res.status(500)

    res.json(data)
}

export async function getUserAndMaxLevelInGroup(req:Request, res:Response) {
    if(typeof req.query.userId === 'undefined' || typeof req.query.teamId === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await userTeamService.getUserAndMaxLevelInGroup(req.query.userId as string, req.query.teamId as string)

    res.status(200)
    if(data && 'rawError' in data)
        res.status(500)

    res.json(data)
}

export async function getLevelSegmentsInTeamWithUsers(req:Request, res:Response) {
    if(typeof req.params.teamId === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await userTeamService.getLevelSegmentsInTeamWithUsers(req.params.teamId)

    res.status(200)
    if(data && 'rawError' in data)
        res.status(500)

    res.json(data)
}

export async function deleteUserTeamRelation(req:Request, res:Response) {
    if(typeof req.query.userId === 'undefined' || typeof req.query.teamId === 'undefined'){
        invalidRequest(res)
        return
    }

    const data = await userTeamService.deleteUserTeamRelation(req.query.userId as string, req.query.teamId as string)

    res.status(200)
    if(typeof data !== 'number' && 'rawError' in data)
        res.status(500)

    res.json(data)
}