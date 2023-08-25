import express from "express"
import * as tokenController from "./../controllers/TokenController"

const router = express.Router()

router.route('/')
    .get(tokenController.getToken)

export = router