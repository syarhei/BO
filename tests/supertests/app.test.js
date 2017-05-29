/**
 * Created by Sergei on 24.05.2017.
 */

let token = 'token';

const app = require('../../index');
const app_test = require('supertest') (app);

function input(user, pass) {
    return app_test.post('/api/sessions')
        .send({ nickname: user, password: pass })
        .expect(200);
}

function getTeams() {
    return app_test.get('/api/teams?limit=20&offset=1')
        .set('Cookie', token)
        .expect(200);
}

function getMatches() {
    return app_test.get('/api/matches?limit=20&offset=1')
        .set('Cookie', token)
        .expect(200);
}

function getBets() {
    return app_test.get('/api/bets?offset=1&limit=20')
        .set('Cookie', token)
        .expect(200);
}

describe('app test', () => {
    beforeAll( async () => {
        let user = await input('admin', 'admin');
        token = user.headers['set-cookie'][0];
        console.log(token);
    });

    it('get teams', async () => {
        let teams = await getTeams();
        console.log({ teams: teams.body });
    });
    it('get matches', async () => {
        let matches = await getMatches();
        console.log({ matches : matches.body });
    });
    it('get bets', async () => {
        let bets = await getBets();
        console.log({ bets : bets.body });
    });
});