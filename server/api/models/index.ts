import * as dotenv from "dotenv"
dotenv.config()

import sequelize from "../../config/sequelize"

import Group from "./GroupModel"
import Task from "./TaskModel"
import Token from "./TokenModel"
import User from "./UserModel"
import { DataTypes } from "sequelize"

/**Relationships */
const UserGroup = sequelize.define('users_groups', {
    level: DataTypes.BOOLEAN
}, { timestamps: false })
User.belongsToMany(Group, { through: UserGroup })
Group.belongsToMany(User, { through: UserGroup })

User.hasOne(Token, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'token'
})

User.hasMany(Task, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'tasks'
})

Group.hasMany(Task, {
    sourceKey: 'id',
    foreignKey: 'groupId',
    as: 'tasks'
})

/**Syncs */
sequelize.sync({ force: true });