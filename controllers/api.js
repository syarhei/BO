'use strict';

const express = require('express');

module.exports = (teamService, matchService, clientService, betService) => {
    const router = express.Router();

    let teamController = require('./team') (teamService, matchService);
    let matchController = require('./match') (matchService, teamService, betService, clientService);
    let sessionController = require('./session') (clientService);
    let clientController = require('./client') (clientService);
    let betController = require('./bet') (betService, clientService, matchService);

    router.use('/teams', teamController);
    router.use('/matches', matchController);
    router.use('/sessions', sessionController);
    router.use('/users', clientController);
    router.use('/bets', betController);

    return router;
}