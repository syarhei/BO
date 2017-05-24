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

let mockTeam = require('../mock/repository') (teams);
let serviceTeam = require('../../services/team') (mockTeam);

describe('teams', () => {
    it ('return promise', () => {
        expect(serviceTeam.getTeams({limit: 10, offset: 1})).toBeInstanceOf(Promise);
    });
    it ('return all teams', async () => {
        let array = await serviceTeam.getTeams({limit: 10, offset: 1});
        expect(mockTeam.findAll).toHaveBeenCalled();
        expect(array).toEqual(teams);
        expect(array).toBeInstanceOf(Array);
    });
    it('return one team', async () => {
        let array = await serviceTeam.getTeam_byId({ full_name : 'team1'});
        expect(mockTeam.findById).toHaveBeenCalled();
        expect(array).toEqual(teams[0]);
        expect(array).toBeInstanceOf(Object);
    });
    it('return error by nonexistent id', async () => {
        let array = await serviceTeam.getTeam_byId({ full_name : 'team3'});
        expect(mockTeam.findById).toHaveBeenCalled();
        expect(array).toEqual({});
        expect(array).toBeInstanceOf(Object);
    });
    it('search team', async () => {
        let array = await serviceTeam.getTeams({limit: 10, offset: 1, full_name: 'team1'});
        expect(mockTeam.findAll).toHaveBeenCalled();
        expect(array).toEqual(teams);
        expect(array).toBeInstanceOf(Array);
    });
    it('add team', async () => {
        let team = {
            full_name: 'team3',
            owner: 'admin',
            year_foundation: 2017
        };
        let array = await serviceTeam.createTeam(team);
        expect(mockTeam.create).toHaveBeenCalled();
        expect(array).toEqual(team);
    });
    it('update team', async () => {
        let team = {
            full_name: 'team1',
            owner: 'admin',
            year_foundation: 2017
        };
        let array = await serviceTeam.updateTeam(team);
        expect(mockTeam.update).toHaveBeenCalled();
        expect(array[0]).toEqual(1);
    });
    it('update [ win draw lose ] team', async () => {
        let win = await serviceTeam.updateTeamWin('team1');
        expect(win).toEqual({result : 'W1'});
        let draw = await serviceTeam.updateTeamDraw('team1');
        expect(draw).toEqual({result : 'D'});
        let lose = await serviceTeam.updateTeamLose('team1');
        expect(lose).toEqual({result : 'W2'});
    });
    it('delete team', async () => {
        let team = {
            full_name: 'team1'
        };
        let array = await serviceTeam.deleteTeam(team);
        expect(mockTeam.destroy).toHaveBeenCalled();
        expect(array).toEqual(1);
    });
});