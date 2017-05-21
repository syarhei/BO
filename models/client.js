'use strict';

module.exports = (sequelize, connect) => {
    return connect.define('client', {
        nickname: {
            type: sequelize.CHAR(20),
            primaryKey: true
        },
        password: {
            type: sequelize.CHAR(20),
            validate: {
                len: [8, 20]
            },
        },
        client_type: {
            type: sequelize.CHAR(5),
            allowNull: false,
        },
        balance: {
            type: sequelize.INTEGER,
            validate: {
                min: 0
            }
        },
        address: sequelize.CHAR(20),
        sex: {
            type: sequelize.CHAR(1),
            validate: {
                isIn: [['W', 'M']]
            }
        }
    })
};