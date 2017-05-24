/**
 * Created by Sergei on 24.05.2017.
 */

let teams = [
    {
        full_name : 'team1',
        owner : 'admin',
        year_foundation : '2017',
        games_team : 2,
        win_team : 1,
        draw_team : 1,
        lose_team : 0,
        points_team : 4
    },
    {
        full_name : 'team2',
        owner : 'admin',
        year_foundation : '2017',
        games_team : 2,
        win_team : 0,
        draw_team : 1,
        lose_team : 1,
        points_team : 1
    }
];
let matches = [
    {
        id_match : 1 ,
        id_team_1 : 1,
        id_team_2 : 2,
        win_1 : 1.11,
        draw : 1.44,
        win_2 : 1.99,
        place : 'msk',
        result : ''
    },
    {
        id_match : 2 ,
        id_team_1 : 1,
        id_team_2 : 2,
        win_1 : 1.21,
        draw : 1.44,
        win_2 : 1.69,
        place : 'msk',
        result : ''
    }
];

let mockMatch = require('../mock/repository') (matches);
let serviceMatch = require('../../services/match') (mockMatch);

describe('matches', () => {
    it('return promise', () => {
        expect(serviceMatch.getMatches({limit: 10, offset: 1})).toBeInstanceOf(Promise);
    });
    it ('return all matches', async () => {
        let array = await serviceMatch.getMatches({limit: 10, offset: 1});
        expect(mockMatch.findAll).toHaveBeenCalled();
        expect(array).toEqual(matches);
        expect(array).toBeInstanceOf(Array);
    });
    it('return one match', async () => {
        let array = await serviceMatch.getMatch_byId({ id_match : 1});
        expect(mockMatch.findById).toHaveBeenCalled();
        expect(array).toEqual(matches[0]);
        expect(array).toBeInstanceOf(Object);
    });
    it('return error by nonexistent id', async () => {
        let array = await serviceMatch.getMatch_byId({ id_match : 3});
        expect(mockMatch.findById).toHaveBeenCalled();
        expect(array).toEqual({});
        expect(array).toBeInstanceOf(Object);
    });
    it('generate match', async () => {
        let array = await serviceMatch.createMatch(teams[0],teams[1],'msk');
        expect(mockMatch.create).toHaveBeenCalled();
        expect(array.id_team_1).toEqual(teams[0].full_name);
        expect(array.id_team_2).toEqual(teams[1].full_name);
    });
    it('generate result', async () => {
        let result1 = await serviceMatch.generateResult_byId(matches[0].id_match);
        let result2 = await serviceMatch.generateResult_byId(matches[1].id_match);
        expect(result1.result).toMatch(new RegExp('W1|D|W2'));
        expect(result2.result).toMatch(new RegExp('W1|D|W2'));
    });
    it('search match', async () => {
        let match = await serviceMatch.searchMatches({limit: 10, offset: 1, full_name: 'team1'});
        expect(mockMatch.findAll).toHaveBeenCalled();
        expect(match).toEqual(matches);
        expect(match).toBeInstanceOf(Array);
    });
    it('check match', async () => {
        let checkTeam = await serviceMatch.checkTeam({ full_name: 'team3'});
        let checkMath = await serviceMatch.checkMatchResult({ id_match: matches[0].id_match });
        expect(checkTeam).toEqual({});
        expect(checkMath).toEqual(matches[0]);
    });
    it('delete match', async () => {
        let match = {
            id_match: 1
        };
        let array = await serviceMatch.deleteMatch(match);
        expect(mockMatch.destroy).toHaveBeenCalled();
        expect(array).toEqual(1);
    });
});