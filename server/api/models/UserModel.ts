import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelize"
import Task from "./TaskModel";
import Group from "./GroupModel";
import Token from "./TokenModel";
import UserGroup from "./UserGroupModel";

class User extends Model<InferAttributes<User, { omit: "tasks" | "groups"  | "token" }>, InferCreationAttributes<User, { omit: "tasks" | "groups"  | "token" }>> {
    declare id: CreationOptional<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>

    declare tasks?: NonAttribute<Task[]>
    declare groups?: NonAttribute<Group[]>
    declare token?: NonAttribute<Token>

    declare username: string
    declare password: string
    declare name: string
    declare email: string
    declare phone: string
    //declare imageUrl: string
    
    declare public static associations: {
        tasks: Association<User, Task>
        groups: Association<User, Group>
        token: Association<User, Token>
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,

        username: {
            type: new DataTypes.STRING(255),
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        password: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        name: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: new DataTypes.STRING(255),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        phone: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isNumeric: {
                    msg: "Field must contain only numbers"
                },
                notEmpty: true
            }
        }
    }, {
        sequelize,
        tableName: 'users'
    }
)

export default User