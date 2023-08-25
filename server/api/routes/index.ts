import express from "express"
import tokenRouter from "./TokenRoutes"

const rootRoutes = express.Router()

rootRoutes.use('/tokens', tokenRouter)

export = rootRoutes