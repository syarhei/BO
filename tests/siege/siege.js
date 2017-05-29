/**
 * Created by Sergei on 28.05.2017.
 */

const siege = require('siege');

siege()
    .on(3300)
    .for(10000).times
    .get('http://bookmaker-office.herokuapp.com/api/teams?limit=20&offset=1')
    .attack();