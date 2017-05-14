const sequelize = require('sequelize');
const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');

const config = require('./config.json');
let app = express();

let connect = require('./database/connect') (sequelize);

let teamService = require('./services/team') (connect.team);
let matchService = require('./services/match') (connect.match, connect.team, connect.bet, connect.client);
let clientService = require('./services/client') (connect.client);
let betService = require('./services/bet') (connect.bet);

let api = require('./controllers/api') (teamService, matchService, clientService, betService);
let auth = require('./utils/session') ();

app.use(express.static('view'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));
app.use(cookie_parser());

app.use('/api', auth);
app.use('/api', api);

connect.sequelize.sync().then(
    () => {
        app.listen(3300, () => {
            console.log('course start');
        })
    }
);