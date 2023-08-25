import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelize"
import User from "./UserModel";

class Token extends Model<InferAttributes<Token, { omit: "user" }>, InferCreationAttributes<Token, { omit: "user" }>> {
    declare id: CreationOptional<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>

    declare userId: ForeignKey<User['id']> | null
    declare user?: NonAttribute<User>

    declare token: string
}

Token.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,

        token: {
            type: new DataTypes.STRING(255),
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        sequelize,
        tableName: 'users_groups'
    }
)

export default Token