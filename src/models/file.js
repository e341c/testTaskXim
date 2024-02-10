// "use strict"
// const { Model } = require("sequelize")
// module.exports = (sequelize, DataTypes) => {
//     class File extends Model {
//         /**
//          * Helper method for defining associations.
//          * This method is not a part of Sequelize lifecycle.
//          * The `models/index` file will call this method automatically.
//          */
//         static associate(models) {
//             // define association here
//         }
//     }
//     File.init(
//         {
//             name: DataTypes.STRING,
//             extension: DataTypes.STRING,
//             mime_type: DataTypes.STRING,
//             size: DataTypes.INTEGER,
//         },
//         {
//             sequelize,
//             modelName: "File",
//         }
//     )
//     return File
// }
;("use strict")
const { Model, DataTypes } = require("sequelize")
const sequelize = require("../db/sequelize")

class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
File.init(
    {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        extension: DataTypes.STRING,
        mime_type: DataTypes.STRING,
        size: DataTypes.INTEGER,
    },
    {
        sequelize,
        modelName: "File",
    }
)

module.exports = File
