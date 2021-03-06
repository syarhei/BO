'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const crypt = require('bcryptjs');
const config = require('../config.json');

module.exports = (clientController) => {
    const client = express.Router();

    client.get('/', (request, response) => {
        let params = request.query;
        clientController.getClients(params).then((result) => {
            response.json(result);
        }).catch((error) => {
            response.json(error);
        })
    });

    client.get('/nickname', (request, response) => {
        response.json({ message: response.nickname, client_type: response.client_type });
    });

    client.get('/balance', (request, response) => {
        let nickname = response.nickname;
        clientController.getClient_byId({ nickname: nickname }).then((result) => {
            response.json({ balance: result.balance });
        }).catch((error) => {
            response.json(error);
        })
    });

    // регистрация
    client.post('/', (request, response) => {
        let params = request.body;
        if (request.cookies.token == undefined) {
            let hash = crypt.hashSync(params.password, 8);
            params.password = hash;
            clientController.createClient(params).then((result) => {
                let token = jwt.sign({ nickname: params.nickname, client_type: result.client_type}, config.jwt.key, { expiresIn: config.jwt.time});
                response.cookie('token', token);
                response.json({ message: result });
            }).catch((error) => {
                response.json({ error: error });
            })
        }
        else response.json({error: "logout, please!"});
    });

    client.delete('/', (request, response) => {
        let token = request.cookies.token;
        let nickname = response.nickname;
        if (token == undefined) response.json({message: "login, please!"});
        else {
            clientController.deleteClient({ nickname: nickname }).then((result) => {
                response.clearCookie("token");
                response.json(result);
            }).catch((error) => {
                response.json(error);
            })
        }
    });

    return client;
};