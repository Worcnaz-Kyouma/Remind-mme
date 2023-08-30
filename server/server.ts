import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
import server from "./config/express"
import rootRoutes from "./api/routes"

server.get('/', (req, res) => {
    res.send('El Psy Kongroo!')
})

server.use('/', rootRoutes)

server.use('/uploads', express.static('uploads'))

const port = process.env.PORT || 22194
server.listen(port, () => {
    console.log("Server running in port: " + port)
})