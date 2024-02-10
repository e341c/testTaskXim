"use strict"
const { Model, DataTypes } = require("sequelize")
const sequelize = require("../db/sequelize")

class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
User.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "User",
    }
)

module.exports = User
