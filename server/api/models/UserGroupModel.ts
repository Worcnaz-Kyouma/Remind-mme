import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../config/sequelize"
import User from "./UserModel";
import Group from "./GroupModel";

class UserGroup extends Model<InferAttributes<UserGroup, { omit: "userId" | "groupId" }>, InferCreationAttributes<UserGroup, { omit: "userId" | "groupId" }>> {
    declare id: CreationOptional<number>

    declare userId: ForeignKey<User['id']>
    declare user?: NonAttribute<User>

    declare groupId: ForeignKey<Group['id']>
    declare group?: NonAttribute<Group>

    declare level: number
}

UserGroup.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },

        level: {
            type: DataTypes.INTEGER.UNSIGNED,
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

export default UserGroup