/**
 * Created by Sergei on 24.05.2017.
 */

'use strict';

module.exports = (data) => {
    const mock = {
        findAll: jest.fn((params) => Promise.resolve(data)),
        findById: jest.fn((id) => {
            return new Promise((resolve, reject) => {
                data.forEach((item, i) => {
                    let array = Object.keys(item);
                    if (id == item[array[0]]) {
                        resolve(item);
                    }

                });
                resolve({});
            })
        }),
        findOne: jest.fn((options) => {
            return new Promise((resolve, reject) => {
                let where = options.where;
                data.forEach((item, i) => {
                    let array = Object.keys(item);
                    if (where[array[0]] == item[array[0]]) {
                        resolve(item);
                    }

                });
                resolve({});
            })
        }),
        create: jest.fn((data) => Promise.resolve(data)),
        update: jest.fn((data) => Promise.resolve([1, data])),
        destroy: jest.fn((params) => Promise.resolve(1)),
        increment: jest.fn((i, options) => Promise.resolve(data))

    };

    mock.mockClear = () => {
        mock.findAll.mockClear();
        mock.findById.mockClear();
        mock.create.mockClear();
        mock.update.mockClear();
        mock.destroy.mockClear();
        mock.increment.mockClear();
    };

    return mock;
};