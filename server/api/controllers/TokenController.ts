import { Request, Response } from "express"
import * as tokenService from "./../services/TokenService"

/*Service functions
    bondService.getBond
*/

function invalidRequest(res:Response){
    res.status(400)
    res.json({error: "Invalid request"})
}

export async function getToken(req:Request, res:Response) {
    if(typeof req.params.id === "undefined" && typeof req.cookies.SESSIONRMM === 'undefined'){
        invalidRequest(res)
        return
    }

    let data:{};
    if(req.cookies.SESSIONRMM !== 'undefined'){
        data = await tokenService.getToken(req.cookies.SESSIONRMM)
    }
    else{
        data = await tokenService.getToken(req.params.id, false)
    }

    res.status(200)
    /*if(data !== null && 'error' in data)
        res.status(getHttpErrorStatusCode(data))*/

    res.json(data)
}