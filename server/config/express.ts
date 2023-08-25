import express from "express"
import cors from "cors"

function createServer() {
    const server = express()

    server.use(express.json())
    server.use(cors())

    return server
}

export = createServer()