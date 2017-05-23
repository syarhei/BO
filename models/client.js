'use strict';

module.exports = (sequelize, connect) => {
    return connect.define('client', {
        nickname: {
            type: sequelize.STRING(20),
            primaryKey: true
        },
        password: {
            type: sequelize.STRING(20),
            validate: {
                len: [8, 20]
            },
        },
        client_type: {
            type: sequelize.STRING(5),
            allowNull: false,
        },
        balance: {
            type: sequelize.INTEGER,
            validate: {
                min: 0
            }
        },
        address: sequelize.STRING(20),
        sex: {
            type: sequelize.CHAR(1),
            validate: {
                isIn: [['W', 'M']]
            }
        }
    })
};