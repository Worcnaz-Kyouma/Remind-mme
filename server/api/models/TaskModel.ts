import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelize"

import User from "./UserModel";
import Group from "./GroupModel";

class Task extends Model<InferAttributes<Task, { omit: "user" | "group" }>, InferCreationAttributes<Task, { omit: "user" | "group" }>> {
    declare id: CreationOptional<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>

    declare userId: ForeignKey<User['id']> | null
    declare user?: NonAttribute<User>

    declare groupId: ForeignKey<Group['id']> | null
    declare group?: NonAttribute<Group>

    declare finalDate: Date | null
    declare name: string
    declare description: string | null
    declare importance: number | null
    //declare imageUrl: string
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,

        finalDate: DataTypes.DATE,
        name: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: DataTypes.TEXT,
        importance: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: 'tasks'
    }
)

export default Task