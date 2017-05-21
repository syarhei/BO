'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
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

    client.get('/:nickname', (request, response) => {
        let nickname = response.nickname;
        let params = request.params;
        if (nickname != 'admin' && nickname != params.nickname)
            response.json({error: "Not permissions"});
        else
            response.json({message: "Hello, " + nickname});
    });

    // регистрация
    client.post('/', (request, response) => {
        let params = request.body;
        if (request.cookies.token == undefined) {
            clientController.createClient(params).then((result) => {
                let token = jwt.sign({ nickname: params.nickname, client_type: result.client_type}, config.jwt.key, { expiresIn: config.jwt.time});
                response.cookie('token', token);
                response.json(result);
            }).catch((error) => {
                response.json(error);
            })
        }
        else response.json({message: "logout, please!"});
    });

    client.delete('/', (request, response) => {
        let token = request.cookies.token;
        let nickname = response.nickname;
        if (token == undefined) response.json({message: "login, please!"});
        else {
            clientController.deleteClient(nickname).then((result) => {
                response.clearCookie("token");
                response.json(result);
            }).catch((error) => {
                response.json(error);
            })
        }
    });

    return client;
};