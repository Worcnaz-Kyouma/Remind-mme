import express from "express"
import * as teamController from "./../controllers/TeamController"

const router = express.Router()

router.route('/')
    .post(teamController.createTeamByOwner)

router.route('/:teamId')
    .delete(teamController.deleteTeamAndRelations)

export = router