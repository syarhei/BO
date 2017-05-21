'use strict';

module.exports = (sequelize, connect, match, client) => {
    return connect.define('bet', {
        id_bet: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_match: {
            type: sequelize.INTEGER,
            references: {
                model: match,
                key: 'id_match'
            },
        },
        nickname: {
            type: sequelize.CHAR(20),
            references: {
                model: client,
                key: 'nickname'
            },
        },
        cost: {
            type: sequelize.INTEGER,
            validate: {
                min: 0
            }
        },
        result: sequelize.CHAR(2),  // ставка пользователя
        isFinished: {  //  завершена ли ставка или нет, когда ставка завершена - она не активна
            type: sequelize.CHAR(1),
            defaultValue: 'N'
        }
    })
};

/*
 true_result: {  // результат матча
 type: sequelize.CHAR(2),
 validate: {
 isIn: [['W1', 'D', 'W2']]
 }
 },
 */