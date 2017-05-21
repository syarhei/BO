'use strict';

module.exports = (matchService) => {
    function getMatchServices(matchService) {
        this.getMatches = getMatches;
        this.searchMatches = searchMatches;
        this.checkTeam = checkTeam;
        this.checkMatchResult = checkMatchResult;
        this.createMatch = generateMatch;
        this.generateResult_byId = generateResult_byId;
        this.deleteMatch = deleteMatch;

        function getMatches(options) {
            let offset = Number((options.offset - 1) * options.limit);
            let limit = Number(options.limit);
            return new Promise((resolve, reject) => {
                matchService.findAll({ offset: offset, limit: limit}).then(resolve).catch(reject);
            })
        }

        function searchMatches(options) {
            let offset = Number((options.offset - 1) * options.limit);
            let limit = Number(options.limit);
            return new Promise((resolve, reject) => {
                matchService.findAll({ offset: offset, limit: limit, where: {
                    $or: {
                        id_team_1: {
                            $like: '%' + options.full_name + '%'
                        },
                        id_team_2: {
                            $like: '%' + options.full_name + '%'
                        }
                    }
                }}).then(resolve).catch(reject);
            })
        }

        function checkTeam(options) {
            return new Promise((resolve, reject) => {
                matchService.findOne({ where: {
                    $or: {
                        id_team_1: options.full_name,
                        id_team_2: options.full_name
                    }
                }}).then(resolve).catch(reject);
            })
        }

        function checkMatchResult(options) {
            return new Promise((resolve, reject) => {
                matchService.findOne({ where: {
                    id_match: options.id_match,
                    result: null
                }}).then(resolve).catch(reject);
            })
        }

        function generateMatch(team_1, team_2, place) {
            let games_1 = team_1.games_team;
            let games_2 = team_2.games_team;
            let points_1 = team_1.points_team;
            let points_2 = team_2.points_team;
            let win_1, draw, win_2;

            if (games_1 == 0 && games_2 == 0) {
                return percent_equals(team_1, team_2, place);
            }
            else {
                let percent_1 = points_1 / (games_1 * 3);
                let percent_2 = points_2 / (games_2 * 3);

                if (percent_1 > percent_2) {
                    let win_1 = (Math.random()/4 + 1.5).toFixed(3);  // делаем коэффициент на win_1 меньше так как шанс что победит 1ая команда больше
                    let draw = (Math.random()/2 + 1.75).toFixed(3);
                    let win_2 = (Math.random() + 2.5).toFixed(3);
                    return createMatch(team_1, team_2, win_1, draw, win_2, place);
                }

                else if (percent_2 > percent_1) {
                    let win_1 = (Math.random() + 2.5).toFixed(3);  // делаем коэффициент на win_1 меньше так как шанс что победит 1ая команда больше
                    let draw = (Math.random()/2 + 1.75).toFixed(3);
                    let win_2 = (Math.random()/4 + 1.5).toFixed(3);
                    return createMatch(team_1, team_2, win_1, draw, win_2, place);
                }

                else return percent_equals(team_1, team_2, place);

            }

        }

        function percent_equals(team_1, team_2, place) {
            let win_1 = (Math.random()/4 + 1.5).toFixed(3);
            let draw = (Math.random()/2 + 1.5).toFixed(3);
            let win_2 = (Math.random()/4 + 1.5).toFixed(3);
            return createMatch(team_1, team_2, win_1, draw, win_2, place);
        }

        function createMatch(team_1, team_2, win_1, draw, win_2, place) {
            let match = {
                id_team_1: team_1.full_name,
                id_team_2: team_2.full_name,
                win_1: win_1,
                draw: draw,
                win_2: win_2,
                place: place
            };
            return new Promise((resolve, reject) => {
                matchService.create(match).then(resolve).catch(reject);
            })
        }

        function generateResult_byId(id_match) {
            return new Promise((resolve, reject) => {
                matchService.findOne({ where: {
                    id_match: id_match,
                    result: null
                }}).then((result) => {
                    if (result == null) throw ({message: "result is null"});  // если такого матча нет с таким id и незавершенным
                    let win_1 = 1 / result.win_1;
                    let draw = 1 / result.draw;
                    let win_2 = 1 / result.win_2;
                    let win_1_percent = win_1 / (win_1 + draw + win_2);
                    let draw_percent = draw / (win_1 + draw + win_2);
                    let win_2_percent = win_2 / (win_1 + draw + win_2);
                    let digit = Math.random();
                    if (digit < win_1_percent) {
                        result.result = "W1";
                        updateResult(result, "W1").then(resolve(result));
                    }
                    else if (digit < (win_1_percent + win_2_percent)) {
                        result.result = "W2";
                        updateResult(result, "W2").then(resolve(result));
                    }
                    else {
                        result.result = "D";
                        updateResult(result, "D").then(resolve(result));
                    }
                }).catch(reject);
            })
        }

        function updateResult(data, result) {
            return new Promise ((resolve, reject) => {
                matchService.update({
                    result: result
                }, { where: {
                    id_match: data.id_match
                }}).then(resolve).catch(reject);
            })
        }

        function deleteMatch(options) {
            return new Promise((resolve, reject) => {
                matchService.destroy(options.id_match).then(resolve).catch(reject);
            })
        }
    }

    return new getMatchServices(matchService);
};

/*

 function generateResult() {
 return new Promise((resolve, reject) => {
 matchService.findAll({ where: {
 result: null
 }}).then((result) => {
 for (let i = 0; i < result.length; i++) {
 let win_1 = 1 / result[i].win_1;
 let draw = 1 / result[i].draw;
 let win_2 = 1 / result[i].win_2;
 let win_1_percent = win_1 / (win_1 + draw + win_2);
 let draw_percent = draw / (win_1 + draw + win_2);
 let win_2_percent = win_2 / (win_1 + draw + win_2);
 let digit = Math.random();
 if (digit < win_1_percent) {
 updateResult(result[i], "W1");
 }
 else if (digit < (win_1_percent + win_2_percent)) {
 updateResult(result[i], "W2");
 }
 else updateResult(result[i], "D");
 }
 resolve(result);
 }).catch(reject);
 })
 }

 */