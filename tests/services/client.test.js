/**
 * Created by Sergei on 24.05.2017.
 */

let clients = [
    {
        nickname : 'sergei',
        password : '12345678',
        client_type : 'user',
        balance : '5000',
        address : 'minsk',
        sex : 'M'
    },
    {
        nickname : 'admin',
        password : '12345678',
        client_type : 'admin',
        balance : '50000',
        address : 'minsk',
        sex : 'M'
    }
];

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

let mockClient = require('../mock/repository') (clients);
let serviceClient = require('../../services/client') (mockClient);

describe('clients', () => {
    it ('return promise', () => {
        expect(serviceClient.getClients({limit: 10, offset: 1})).toBeInstanceOf(Promise);
    });
    it ('return all clients', async () => {
        let array = await serviceClient.getClients({limit: 10, offset: 1});
        expect(mockClient.findAll).toHaveBeenCalled();
        expect(array).toEqual(clients);
        expect(array).toBeInstanceOf(Array);
    });
    it('return one client', async () => {
        let array = await serviceClient.getClient_byId({ nickname : 'sergei'});
        expect(mockClient.findById).toHaveBeenCalled();
        expect(array).toEqual(clients[0]);
        expect(array).toBeInstanceOf(Object);
    });
    it('return error by nonexistent id', async () => {
        let array = await serviceClient.getClient_byId({ full_name : 'serega'});
        expect(mockClient.findById).toHaveBeenCalled();
        expect(array).toEqual({});
        expect(array).toBeInstanceOf(Object);
    });
    it('check client', async () => {
        let array = await serviceClient.checkClient({ nickname: 'sergei', password: '12345678'});
        expect(mockClient.findAll).toHaveBeenCalled();
        expect(array).toEqual(clients[0]);
        expect(array).toBeInstanceOf(Object);
    });
    it('add client', async () => {
        let client = {
            nickname: 'user',
            password: '12345678',
            address: 'minsk',
            sex: 'M'
        };
        let array = await serviceClient.createClient(client);
        expect(mockClient.create).toHaveBeenCalled();
        expect(array.nickname).toEqual(client.nickname);
    });
    it('update client balance', async () => {
        let array = await serviceClient.updateBalance(bets, 1.78);
        expect(array).toEqual(1.78);
    });
    it('delete client', async () => {
        let client = {
            nickname: 'sergei'
        };
        let array = await serviceClient.deleteClient(client);
        expect(mockClient.destroy).toHaveBeenCalled();
        expect(array).toEqual(1);
    });
});