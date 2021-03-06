'use strict';

const bluebird = require('bluebird');

module.exports = (clientService) => {
    function getClientServices(clientService) {
        this.getClient_byId = getClient_byId;
        this.getClients = getClients;
        this.checkClient = checkClient;
        this.createClient = createClient;
        this.updateClientPassword = updateClientPassword;
        this.updateBalance = updateBalance;
        this.updateBalance_createBet = updateBalance_createBet;
        this.deleteClient = deleteClient;

        function getClient_byId(options) {
            return new Promise((resolve, reject) => {
                clientService.findById(options.nickname).then(resolve).catch(reject);
            })
        }

        function getClients(options) {
            let offset = Number((options.offset - 1) * options.limit);
            let limit = Number(options.limit);
            return new Promise((resolve, reject) => {
                clientService.findAll({ offset: offset, limit: limit}).then(resolve).catch(reject);
            });
        }

        function checkClient(options) {
            return new Promise((resolve, reject) => {
                clientService.findOne({ where: {
                    nickname: options.nickname,
                    password: options.password
                }}).then(resolve).catch(reject);
            })
        }

        function checkTable() {
            return new Promise((resolve, reject) => {
                clientService.findAll({}).then(resolve).catch(reject);
            })
        }

        function createClient(options) {
            return checkTable().then((result) => {
                let type = 'user';
                let balance = 50000;
                if (result.length == 0) {
                    type = 'admin';
                    balance = 1000000;
                }
                let client = {
                    nickname: options.nickname,
                    password: options.password,
                    client_type: type,
                    balance: balance,
                    address: options.address,
                    sex: options.sex
                };
                return new Promise((resolve, reject) => {
                    clientService.create(client).then(resolve).catch(reject);
                });
            });
        }

        function updateClientPassword(options) {
            let client = {
                password: options.password
            };
            return new Promise((resolve, reject) => {
                clientService.update(client, { where: {
                    nickname: options.nickname
                }}).then(resolve).catch(reject);
            })
        }

        function updateBalance(bets, coefficient) {
            return new Promise((resolve, reject) => {
                let promise = [];
                for (let bet in bets) {
                    promise.push(updateClientBalance(bets[bet], coefficient));
                    promise.push(updateAdminBalance(bets[bet], coefficient));
                }
                Promise.all(promise).then(resolve(coefficient)).catch(reject);
            })
        }
        
        function updateBalance_createBet(options) {
            return updateClientBalance(options, 1).then((data) => {
                return updateAdminBalance(options, 1);
            });
        }

        function updateClientBalance(options, coefficient) {
            return new Promise((resolve, reject) => {
                return getClient_byId(options).then((bet) => {
                    if (bet.balance < Math.abs(options.cost)) throw { message: 'Your bet exceed balance'};
                    return bet.increment('balance', {by: options.cost*coefficient}).then(resolve);
                }).catch(reject);
            })
        }

        function updateAdminBalance(options, coefficient) {
            return new Promise((resolve, reject) => {
                return getClient_byId({nickname: 'admin'}).then((bet) => {
                    return bet.decrement('balance', {by: options.cost*coefficient}).then(resolve);
                }).catch(reject);
            })
        }

        function deleteClient(options) {
            return new Promise((resolve, reject) => {
                clientService.destroy({
                    where: {
                        nickname: options.nickname
                    }
                }).then(resolve).catch(reject);
            })
        }
    }

    return new getClientServices(clientService);
};