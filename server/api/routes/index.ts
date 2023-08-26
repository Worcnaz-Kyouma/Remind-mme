import express from "express"
import userRouter from "./UserRoutes"

const rootRoutes = express.Router()

rootRoutes.use('/users', userRouter)

export = rootRoutes