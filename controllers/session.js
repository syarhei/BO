'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const crypt = require('bcryptjs');
const config = require('../config.json');

module.exports = (clientService) => {
    const session = express.Router();

    // авторизация
    session.post('/', (request, response) => {
        let params = request.body;
        clientService.getClient_byId({ nickname: params.nickname}).then((client) => {
            if (client == null) throw "This user is not found";
            let test = crypt.compareSync(params.password, client.password);
            if (!test) {
                response.json({error: "This password is not define"});
            }
            else {
                let token = jwt.sign({ nickname: params.nickname, client_type: client.client_type}, config.jwt.key, { expiresIn: config.jwt.time});
                response.cookie('token', token);
                response.json({message: "hello , " + params.nickname});
            }
        }).catch((error) => {
            response.json({ error: error });
        })
    });

    session.delete('/', (request, response) => {
        response.clearCookie("token");
        response.json({message: "logout"});
    });

    return session;
};