module.exports = (sequelize, connect) => {
    return connect.define('balance', {
        id_operation: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        b_difference: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        b_type: {
            type: sequelize.CHAR(30),
            allowNull: false
        },
        b_date: {
            type: sequelize.DATE,
            allowNull: false
        },
        b_time: {
            type: sequelize.TIME,
            allowNull: false
        },
    })
}