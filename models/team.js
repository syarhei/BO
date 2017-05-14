module.exports = (sequelize, connect) => {
    return connect.define('team', {
        full_name: {
            type: sequelize.CHAR(20),
            primaryKey: true,
        },
        owner: {
            type: sequelize.CHAR(20),
            allowNull: false,
        },
        year_foundation: {
            type: sequelize.INTEGER,
            allowNull: false,
        },
        games_team: {
            type: sequelize.INTEGER,
            defaultValue: 0
        },
        win_team: {
            type: sequelize.INTEGER,
            defaultValue: 0
        },
        draw_team: {
            type: sequelize.INTEGER,
            defaultValue: 0
        },
        lose_team: {
            type: sequelize.INTEGER,
            defaultValue: 0
        },
        points_team: {
            type: sequelize.INTEGER,
            defaultValue: 0
        }
    })
};