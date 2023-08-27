import express from "express"
import userRoutes from "./UserRoutes"
import teamRoutes from "./TeamRoutes"
import userTeamRoutes from "./UserTeamRoutes"

const rootRoutes = express.Router()

rootRoutes.use('/users', userRoutes)
rootRoutes.use('/teams', teamRoutes)
rootRoutes.use('/usersteams', userTeamRoutes)

export = rootRoutes