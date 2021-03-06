'use strict';

module.exports = (betService) => {
    function getBetServices(betService) {
        this.getBets = getBets;
        this.getBet_byId = getBet_byId;
        this.finishBets = finishBets;
        this.getBets_byMatch = getBets_byMatch;
        this.getBets_byClient = getBets_byClient;
        this.createBet = createBet;
        this.deleteBet = deleteBet;

        function getBets(options) {
            let offset = Number((options.offset - 1) * options.limit);
            let limit = Number(options.limit);
            return new Promise((resolve, reject) => {
                betService.findAll({ offset: offset, limit: limit}).then(resolve).catch(reject);
            });
        }

        function getBet_byId(id_bet) {
            return new Promise((resolve, reject) => {
                betService.findById(id_bet).then(resolve).catch(reject);
            })
        }

        function getBets_byClient(options, client) {
            let offset = Number((options.offset - 1) * options.limit);
            let limit = Number(options.limit);
            return new Promise((resolve, reject) => {
                betService.findAll({ offset: offset, limit: limit, where: {
                    nickname: client
                }}).then(resolve).catch(reject);
            })
        }

        function getBets_byMatch(id_match, resultMatch) {
            return new Promise((resolve, reject) => {
                betService.findAll({ where: {
                    id_match: id_match,
                    isFinished: 'N',
                    result: resultMatch
                }}).then(resolve).catch(reject);
            })
        }

        function finishBets(id_match, coefficient, result) {
            return updateDifference(id_match, coefficient, result).then(() => {
                return new Promise((resolve, reject) => {
                    let bet = {
                        isFinished: 'Y'
                    };
                    betService.update(bet, {
                        where: {
                            id_match: id_match,
                            isFinished: 'N'
                        }
                    }).then(resolve).catch(reject);
                })
            })
        }

        function updateDifference(id_match, coefficient, result) {
            return new Promise((resolve, reject) => {
                return getBets_byMatch(id_match, result).then((bets) => {
                    let promise = [];
                    for (let bet in bets)
                        promise.push(betDifference(bets[bet], coefficient));
                    Promise.all(promise).then(resolve(coefficient)).catch(reject);
                }).catch(reject);
            })
        }

        function betDifference(bet, coefficient) {
            return new Promise((resolve, reject) => {
                return bet.increment('difference', {by: (bet.cost*coefficient)}).then(resolve).catch(reject);
            })
        }

        function createBet(options, client) {
            let bet = {
                nickname: client,
                id_match: options.id_match,
                cost: options.cost,
                result: options.result,
                difference: -options.cost
            };
            return new Promise((resolve, reject) => {
                betService.create(bet).then(resolve).catch(reject);
            })
        }

        function deleteBet(options, client, client_type) {
            if (client_type == 'admin')
                return deleteBetAdmin(options);
            else
                return new Promise((resolve, reject) => {
                    betService.destroy({ where: {
                        id_bet: options.id_bet,
                        nickname: client
                    }}).then(resolve).catch(reject);
            })
        }

        function deleteBetAdmin(options) {
            return new Promise((resolve, reject) => {
                betService.destroy({ where: {
                    id_bet: options.id_bet
                }}).then(resolve).catch(reject);
            })
        }
    }

    return new getBetServices(betService);
};