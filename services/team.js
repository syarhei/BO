module.exports = (teamService) => {

    function getTeamServices(teamService) {

        this.getTeam_byId = getTeam_byId;
        this.getTeams = getTeams;
        this.searchTeams = searchTeams;
        this.createTeam = createTeam;
        this.updateTeam = updateTeam;
        this.updateTeamWin = updateTeamWin;
        this.updateTeamDraw = updateTeamDraw;
        this.updateTeamLose = updateTeamLose;
        this.deleteTeam = deleteTeam;

        function getTeam_byId(options) {
            return new Promise((resolve, reject) => {
                teamService.findById(options.full_name).then(resolve).catch(reject);
            })
        }

        function getTeams(options) {
            let offset = Number((options.offset - 1) * options.limit);
            let limit = Number(options.limit);
            return new Promise((resolve, reject) => {
                teamService.findAll({ offset: offset, limit: limit}).then(resolve).catch(reject);
            })
        }

        function searchTeams(options) {
            let offset = Number((options.offset - 1) * options.limit);
            let limit = Number(options.limit);
            return new Promise((resolve, reject) => {
                teamService.findAll({ offset: offset, limit: limit, where: {
                    full_name: {
                        $like: '%' + options.full_name + '%'
                    }
                }}).then(resolve).catch(reject);
            })
        }

        function createTeam(options) {
            let team = {
                full_name: options.full_name,
                owner: options.owner,
                year_foundation: options.year_foundation
            };
            return new Promise((resolve, reject) => {
                teamService.create(team).then(resolve).catch(reject);
            })
        }

        function updateTeam(options) {
            let team = {
                owner: options.owner,
                year_foundation: options.year_foundation
            };
            return new Promise((resolve, reject) => {
                teamService.update(team, { where: {
                    full_name: options.full_name
                }}).then(resolve).catch(reject);
            })
        }

        function updateTeamWin(full_name) {
            return getTeam_byId({ full_name: full_name }).then((result) => {
                let team = {
                    win_team: result.win_team + 1,
                    games_team: result.games_team + 1,
                    points_team: result.points_team + 3
                };
                return new Promise((resolve, reject) => {
                    teamService.update(team, { where: {
                        full_name: full_name
                    }}).then(() => {
                        resolve({ result: "W1"});
                    }).catch(reject);
                })
            });

        }

        function updateTeamDraw(full_name) {
            return getTeam_byId({ full_name: full_name }).then((result) => {
                let team = {
                    draw_team: result.draw_team + 1,
                    games_team: result.games_team + 1,
                    points_team: result.points_team + 1
                };
                return new Promise((resolve, reject) => {
                    teamService.update(team, { where: {
                        full_name: full_name
                    }}).then(() => {
                        resolve({ result: "D"});
                    }).catch(reject);
                })
            });
        }

        function updateTeamLose(full_name) {
            return getTeam_byId({ full_name: full_name }).then((result) => {
                let team = {
                    lose_team: result.lose_team + 1,
                    games_team: result.games_team + 1
                };
                return new Promise((resolve, reject) => {
                    teamService.update(team, { where: {
                        full_name: full_name
                    }}).then(() => {
                        resolve({ result: "W2"});
                    }).catch(reject);
                })
            });
        }

        function deleteTeam(options) {
            return new Promise((resolve, reject) => {
                teamService.destroy({
                    where: {
                        full_name: options.full_name
                    }
                }).then(resolve).catch(reject);
            })
        }
    }

    return new getTeamServices(teamService);
};