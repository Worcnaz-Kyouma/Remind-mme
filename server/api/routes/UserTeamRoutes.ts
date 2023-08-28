import express from "express"
import * as userTeamController from "./../controllers/UserTeamController"

const router = express.Router()

router.route('/')
    .post(userTeamController.createUserTeamRelation)
    .delete(userTeamController.deleteUserTeamRelation)

router.route('/level-compare')
    .get(userTeamController.getUserAndMaxLevelInGroup)

router.route('/:teamId')
    .get(userTeamController.getLevelSegmentsInTeamWithUsers)


export = router