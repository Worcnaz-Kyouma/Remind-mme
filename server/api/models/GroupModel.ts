import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelize"
import User from "./UserModel";
import Task from "./TaskModel";

class Group extends Model<InferAttributes<Group, { omit: "users" | 'tasks' }>, InferCreationAttributes<Group, { omit: "users" | 'tasks' }>> {
    declare id: CreationOptional<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>

    declare users?: NonAttribute<User[]>
    declare tasks?: NonAttribute<Task[]>

    declare name: string

    declare public static associations: {
        users: Association<Group, User>
        tasks: Association<Group, Task>
    }
}

Group.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,

        name: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        }
    }, {
        sequelize,
        tableName: 'groups'
    }
)

export default Group