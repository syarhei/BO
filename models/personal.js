module.exports = (sequelize, connect) => {
    return connect.define('personal', {
        id_personal: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize.CHAR(20),
            allowNull: false,
        },
        salary: {
            type: sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100
            }
        },
        total_salary: {
            type: sequelize.INTEGER,
            defaultValue: 0
        },
        age: {
            type: sequelize.INTEGER,
            validate: {
                min: 16,
                max: 70
            }
        },
        phone: sequelize.CHAR(20),
        profession: sequelize.CHAR(20),
        interesting: sequelize.CHAR(20)
    })
}