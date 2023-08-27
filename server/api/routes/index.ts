import express from "express"
import userRoutes from "./UserRoutes"
import teamRoutes from "./TeamRoutes"

const rootRoutes = express.Router()

rootRoutes.use('/users', userRoutes)
rootRoutes.use('/teams', teamRoutes)

export = rootRoutes