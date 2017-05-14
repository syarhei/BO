const express = require('express');

module.exports = (teamController, matchController) => {
    const team = express.Router();

    team.post('/', (request, response)=> {
        let params = request.body;
        teamController.createTeam(params).then((result) => {
            response.json(result);
        }).catch((error) => {
            response.json(error);  // выводим смс об ошибке в случае если даже 1 поле не задано или равно 0, лиюо уже есть такая команда
        })
    });

    team.put('/', (request, response) => {
        let params = request.body;
        teamController.updateTeam(params).then((result) => {
            response.json(result);
        }).catch((error) => {
            response.json(error);
        })
    });

    team.get('/:full_name', (request, response) => {
       let params = request.params;
       teamController.getTeam_byId(params).then((result) => {
           response.json(result);
       }).catch((error) => {
           response.json(error);
       })
    });

    team.get('/', (request, response) => {
        let params = request.query;
        let nickname = response.nickname;
        if (params.full_name != undefined) {
            teamController.searchTeams(params).then((result) => {
                response.json(result);
            }).catch((error) => {
                response.json(error);
            })
        }
        else {
            teamController.getTeams(params).then((result) => {
                response.json(result);
            }).catch((error) => {
                response.json(error);
            })
        }
    });

    team.delete('/', (request, response) => {
        let params = request.body;
        matchController.checkTeam(params).then((result) => {
            if (result == null) {
                return teamController.deleteTeam(params);
            }
            else response.json({ error: "This team already plays in match"});
        }).then((result) => {
            if (result == 1)
                response.json({ message: "Team is delete"});
            else response.json({ message: "This team is not in DB"});
        }).catch((error) => {
            response.json(error);
        })
    });

    return team;
};