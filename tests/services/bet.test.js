/**
 * Created by Sergei on 24.05.2017.
 */

let bets = [
    {
        id_bet : 1,
        id_match : 1,
        nickname : 'sergei',
        cost : 100,
        result : 'W1',
        isFinished : 'N'
    },
    {
        id_bet : 2,
        id_match : 1,
        nickname : 'ivan',
        cost : 100,
        result : 'W2',
        isFinished : 'N'
    }
];

let mockBet = require('../mock/repository') (bets);
let serviceBet = require('../../services/bet') (mockBet);

describe('bets', () => {
    it ('return promise', () => {
        expect(serviceBet.getBets({limit: 10, offset: 1})).toBeInstanceOf(Promise);
    });
    it ('return all bets', async () => {
        let array = await serviceBet.getBets({limit: 10, offset: 1});
        expect(mockBet.findAll).toHaveBeenCalled();
        expect(array).toEqual(bets);
        expect(array).toBeInstanceOf(Array);
    });
    it('return one bet', async () => {
        let array = await serviceBet.getBet_byId(1);
        expect(mockBet.findById).toHaveBeenCalled();
        expect(array).toEqual(bets[0]);
        expect(array).toBeInstanceOf(Object);
    });
    it('return error by nonexistent id', async () => {
        let array = await serviceBet.getBet_byId(3);
        expect(mockBet.findById).toHaveBeenCalled();
        expect(array).toEqual({});
        expect(array).toBeInstanceOf(Object);
    });
    it('return bets by client', async () => {
        let array = await serviceBet.getBets_byClient({limit: 10, offset: 1}, 'sergei');
        expect(mockBet.findAll).toHaveBeenCalled();
        expect(array).toEqual(bets);
        expect(array).toBeInstanceOf(Array);
    });
    it('return bets by match', async () => {
        let array = await serviceBet.getBets_byMatch(1, 'W1');
        expect(mockBet.findAll).toHaveBeenCalled();
        expect(array).toEqual(bets);
        expect(array).toBeInstanceOf(Array);
    });
    it('finish bet', async () => {
        let array = await serviceBet.finishBets(1);
        expect(mockBet.update).toHaveBeenCalled();
        expect(array[0]).toEqual(1);
        expect(array[1].isFinished).toEqual('Y');
    });
    it('add bet', async () => {
        let bet = {
            nickname: 'sergei',
            id_match: 1,
            cost: 100,
            result: 'D',
            difference: -100
        };
        let array = await serviceBet.createBet(bet, bet.nickname);
        expect(mockBet.create).toHaveBeenCalled();
        expect(array).toEqual(bet);
    });
    it('delete bet', async () => {
        let bet = {
            id_bet: 1
        };
        let array = await serviceBet.deleteBet(bet);
        expect(mockBet.destroy).toHaveBeenCalled();
        expect(array).toEqual(1);
    });
});