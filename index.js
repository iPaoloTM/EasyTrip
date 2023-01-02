'use strict';

const config = require('./config');
const auth = require('./processes/auth/service');
const OSMTools = require('./processes/OSMTools/service');
const pointSearch = require('./processes/pointSearch/service');
const pathSearch = require('./processes/pathSearch/service');

//Check Env
const AUTH_PORT = process.env.AUTH_PORT || 12345;
const OSM_PORT = process.env.OSM_PORT || 12346;
const POINT_PORT = process.env.POINT_PORT || 12347;
const PATH_PORT = process.env.PATH_PORT || 12348;

config.initDB()
    .then(msg => {
        console.log(msg);

        const pA = auth.listen(AUTH_PORT, () => {
            console.log("Authentication process started. Port: ", AUTH_PORT);
        });

        const pOSM = OSMTools.listen(OSM_PORT, () => {
            console.log("OSM Tools process started. Port: ", OSM_PORT);
        });
        
        const pPoint = pointSearch.listen(POINT_PORT, () => {
            console.log("Point Search process started. Port: ", POINT_PORT);
        });

        const pPath = pathSearch.listen(PATH_PORT, () => {
            console.log("Path Search process started. Port: ", PATH_PORT);
        });
    })
    .catch(err => {
        throw(new Error(err));
    });