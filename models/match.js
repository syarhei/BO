'use strict';

module.exports = (sequelize, connect, team) => {
    return connect.define('match', {
        id_match: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_team_1: {
            type: sequelize.STRING(20),
            references: {
                model: team,
                key: 'full_name'
            },
        },
        id_team_2: {
            type: sequelize.STRING(20),
            references: {
                model: team,
                key: 'full_name'
            },
        },
        win_1: {
            type: sequelize.REAL,
            allowNull: false,
        },
        draw: {
            type: sequelize.REAL,
            allowNull: false,
        },
        win_2: {
            type: sequelize.REAL,
            allowNull: false,
        },
        place: sequelize.STRING(20),
        result: sequelize.STRING(2),
    })
};