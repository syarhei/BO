'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config.json');
const permissions = require('../permissions.json');

module.exports = () => {

    function checkPermission(client_type, method, path) {
        let paths = permissions[client_type];
        let isIn = false;
        for (let path_method in paths) {
            if (path_method == method) {
                if (paths.hasOwnProperty(path_method)) {
                    let urls = paths[path_method];
                    for (let url in urls) {
                        if (urls.hasOwnProperty(url))
                            if (urls[url] == path)
                                isIn = true;
                    }
                }
            }
        }
        return isIn;
    }

    return (request, response, next) => {
        let path = request._parsedUrl.pathname;
        let method = request.method;
        let token = request.cookies.token;
        if (token == undefined) {
            let client_type = "guest";
            let isIn = checkPermission(client_type, method, path);
            if (isIn == false) response.json({error: "Not permissions"});
            else next();
        }
        else {
            jwt.verify(token, config.jwt.key, (error, data) => {
                if (data.nickname == 'undefined') response.json("Login, token is timing off");
                response.nickname = data.nickname;  // как другим способом отправить имя в следующий запрос
                response.client_type = data.client_type;
                let client_type = data.client_type;
                if (client_type == 'admin') next();
                else {
                    let isIn = checkPermission(client_type, method, path);
                    if (isIn == false) response.json({error: "Not permissions"});
                    else next();
                }
            });
        }
    }
};