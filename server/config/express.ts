import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

function createServer() {
    const server = express()

    server.use(express.json())
    server.use(cors())
    server.use(cookieParser())

    return server
}

export = createServer()