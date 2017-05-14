const express = require('express');

module.exports = (matchController, teamController, betController, clientController) => {
    let match = express.Router();

    match.get('/', (request, response) => {
        let params = request.query;
        if (params.full_name != undefined) {
            matchController.searchMatches(params).then((result) => {
                response.json(result);
            }).catch((error) => {
                response.json(error);
            })
        }
        else {
            matchController.getMatches(params).then((result) => {
                response.json(result);
            }).catch((error) => {
                response.json(error);
            })
        }
    });

    match.post('/', (request, response) => {
        let params = request.body;
        let id_team_1, id_team_2;
        teamController.getTeam_byId({ full_name: params.id_team_1 }).then((result) => {
            id_team_1 = result.toJSON();
            return teamController.getTeam_byId({ full_name: params.id_team_2 });

        }).then((result) => {
            id_team_2 = result.toJSON();
            return matchController.createMatch(id_team_1, id_team_2, params.place);

        }).then((result) => {
            response.json(result);

        }).catch((error) => {
            response.json(error);
        });
    });

    match.post('/:id_match/results/generation', (request, response) => {
        let id_match = request.params.id_match;
        let nickname = response.nickname;
        matchController.generateResult_byId(id_match).then((match) => {  // генерируем результат матча
            switch (match.result) {  // обновляем таблицу teams по результату матча
                case 'W1': return Promise.all([teamController.updateTeamWin(match.id_team_1), teamController.updateTeamLose(match.id_team_2)]).then(()=>{return {result: match.result, coefficient: match.win_1}}); break;
                case 'W2': return Promise.all([teamController.updateTeamLose(match.id_team_1), teamController.updateTeamWin(match.id_team_2)]).then(()=>{return {result: match.result, coefficient: match.win_2}}); break;
                case 'D': return Promise.all([teamController.updateTeamDraw(match.id_team_1), teamController.updateTeamDraw(match.id_team_2)]).then(()=>{return {result: match.result, coefficient: match.draw}}); break;
                default: response.json(match);
            }
        }).then((match) => {
            return betController.getBets_byMatch(id_match, match.result).then((bets) => {  // получаем все выигрышные ставки с данным результатом
                return clientController.updateBalance(bets, match.coefficient);  // обновляем таблицу clients согласно каждой ставке
            })
        }).then((obj) => {
            betController.finishBets(id_match).then(response.json(obj));
        }).catch((error) => {
            response.json(error);
        });
    });

    match.delete('/', (request, response) => {
        let params = request.body;
        matchController.deleteMatch(params).then((result) => {
            response.json(result);
        }).catch((error) => {
            response.json(error);
        })
    });

    return match;
};

/*

 match.post('/results/generation', (request, response) => {  // норм рест апи? мб другое слово нужно написать или другой метод
 matchController.generateResult().then((result) => {
 response.json(result);
 }).catch((error) => {
 response.json(error);
 })
 });

 */