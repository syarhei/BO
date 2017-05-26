'use strict';

const express = require('express');

module.exports = (betController, clientController, matchController) => {
    const bet = express.Router();

    bet.get('/', (request, response) => {
        let params = request.query;
        let nickname = response.nickname;
        if (nickname == 'admin') {  // если админ то возвращает все ставки, иначе только те которые принадлежат данному пользователю
            betController.getBets(params).then((result) => {
                response.json(result);
            }).catch((error) => {
                response.json(error);
            });
        }
        else {
            betController.getBets_byClient(params, nickname).then((result) => {
                response.json(result);
            }).catch((error) => {
                response.json(error);
            })
        }
    });

    bet.post('/', (request, response) => {
        let params = request.body;
        let nickname = response.nickname;
        matchController.checkMatch({ id_match: params.id_match }).then((result) => {
            if (params.cost < 0) throw { message: 'Your bet is less 0'};
            if (result == null) throw 'id_match is not found';
            return clientController.updateBalance_createBet({ cost: -params.cost, nickname: nickname }).then((data) => {
                return betController.createBet(params, nickname).then((result) => {
                    response.json(result);
                })
            })
        }).catch((error) => {
            response.json({ error: error });
        })
    });

    bet.delete('/', (request, response) => {
        let params = request.body;
        let nickname = response.nickname;
        let client_type = response.client_type;
        betController.getBet_byId(params.id_bet).then((bet) => {
            if (bet == undefined) throw ({message: "id_bet is undefined"});
            if (bet.isFinished == 'Y')
                betController.deleteBet(params, nickname, client_type).then((result) => {
                    response.json(result);
                });
            else
                clientController.updateBalance_createBet({ cost: bet.cost, nickname: bet.nickname }).then((data) => {
                    betController.deleteBet(params, nickname, client_type).then((result) => {
                        response.json(result);
                    })
            })
        }).catch((error) => {
            response.json(error);
        })

    });

    return bet;
};