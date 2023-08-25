import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
import server from "./config/express"

server.get('/', (req, res) => {
    res.send('El Psy Kongroo!')
})

const port = process.env.PORT
server.listen(port, () => {
    console.log("Server running in port: " + port)
})