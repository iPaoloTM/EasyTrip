'use strict';

const { pointToStr,pointArrayToObj,cleanWrtStruct,arrayToStr,reversePointArray } = require("../../../common/functions");
const { OSM_TOOLS_URL,INTERESTS,PROFILES } = require("../../../common/dataStructures");

const request = require('request-promise');
const geolib = require('geolib');
//const fs = require('fs'); //Temporaneo

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
}

module.exports.stops = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    let start = req.query.start;
    let end = req.query.end;
    let interests = Array.isArray(req.query.interest) ? req.query.interest : [req.query.interest];
    let strLimit = req.query.limit;
    let minDistanceStr = req.query.minDistance;
    let maxDetourStr = req.query.maxDetour;
    let profile = req.query.profile;
    let poisDescriptions = req.query.poisDescriptions;

    let stops = await getStops(start,end,interests,strLimit,minDistanceStr,maxDetourStr,profile,poisDescriptions);

    if (stops != null) {
        res.status(200).json({
            //user: req.loggedUser,
            stops: stops
        });
    } else {
        res.status(400).json({
            error: MSG.badRequest
        });
    }
};

module.exports.route = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    /*
    usare metodo stops per ritornare città interessanti
    richiamare routing/route con start, end e città interessanti (a due a due)
    */

	res.status(200).json({
        success: true,
        user: req.loggedUser,
        message: 'ES2 con token'
    });
};

async function getStops(start,end,interests,strLimit = "3",minDistanceStr = "20000",maxDetourStr = "10000",profile = "car", poisDescriptions = true) {

    let stops = {
        start: {},
        end: {},
        intermediates: []
    };
    let poiDirections = [0,-1,1];
    let i, j, limit, minDistance, maxDetour, right, path, subPathLen, interestsStr, pois, poiTollerance, maxMiddlePoint, currentMiddlePoint;
    //Request check
    if (start != undefined
            && end != undefined
            && (interests = cleanWrtStruct(interests,INTERESTS)).length
            && !isNaN(limit = parseInt(strLimit)) && limit >= 0 && limit <= 8
            && !isNaN(minDistance = parseFloat(minDistanceStr))
            && !isNaN(maxDetour = parseFloat(maxDetourStr)) && maxDetour <= (minDistance/2)
            && PROFILES[profile] != undefined) {
        //Retrieve start and end coordinates and informations
        try {
            stops.start = (await request(OSM_TOOLS_URL + "/v1/routing/geocode?limit=1&address=" + start)
                            .then(response => JSON.parse(response))).hits[0];
            stops.end = (await request(OSM_TOOLS_URL + "/v1/routing/geocode?limit=1&address=" + end)
                        .then(response => JSON.parse(response))).hits[0];
            /*stops.start = {
                point: { lat: 45.4384958, lng: 10.9924122 },
                extent: [ 10.8768512, 45.3494402, 11.1239, 45.5418375 ],
                name: 'Verona',
                country: 'Italy',
                countrycode: 'IT',
                state: 'Veneto',
                osm_id: 44830,
                osm_type: 'R',
                osm_key: 'place',
                osm_value: 'city'
            };
            stops.end = {
                "point": {
                    "lat": 41.8933203,
                    "lng": 12.4829321
                },
                "extent": [
                    12.2344669,
                    41.6556417,
                    12.8557603,
                    42.1410285
                ],
                "name": "Rome",
                "country": "Italy",
                "countrycode": "IT",
                "state": "Lazio",
                "osm_id": 41485,
                "osm_type": "R",
                "osm_key": "place",
                "osm_value": "city"
            };*/
            right = stops.start != undefined && stops.end != undefined ? true : false;
        } catch (error) {
            console.error(error);
            right = false;
        }
    } else {
        right = false;
    }
    
    //Compute intermediary stops
    if (right) {
        try {
            //Retrieve route between start and end
            path = (await request(OSM_TOOLS_URL + "/v1/routing/route?point=" + pointToStr(stops.start) + "&point=" + pointToStr(stops.end) + "&profile=" + profile)
                            .then(response => JSON.parse(response))).paths[0];
            /*fs.readFile('./processes/pathSearch/controllers/tmp.json', 'utf8', async (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                path = JSON.parse(data).stops;
                
            });*/
            
            //Find at most limit intermediary points at least minDistance apart
            right = false;
            while (limit > 0 && !right) {
                subPathLen = Math.round(path.points.coordinates.length/(limit+1));
                for (i = subPathLen; i < subPathLen*(limit+1); i += subPathLen) {
                    stops.intermediates.push(path.points.coordinates[i]);
                }
                if (geolib.getDistance(pointArrayToObj(stops.intermediates[0]),pointArrayToObj(stops.intermediates[1])) < minDistance) {
                    limit--;
                } else {
                    right = true;
                }
            }

            //For every point, search pois related with user interests and find the city with most of them
            interestsStr = arrayToStr(interests,"&interest=",true);
            poiTollerance = Math.round(subPathLen*0.2);
            for (i = 0; i < stops.intermediates.length; i++) {
                //Find pois
                j = 0;
                do {
                    stops.intermediates[i] = reversePointArray(!poiDirections[j] ? stops.intermediates[i] : path.points.coordinates[subPathLen*(i+1)+poiDirections[j]*poiTollerance]);
                    try {
                        pois = (await request(OSM_TOOLS_URL + "/v1/locations/poi?point=" + pointToStr(stops.intermediates[i]) + interestsStr + "&squareSide=" + maxDetour)
                            .then(response => JSON.parse(response))
                            .catch(error => new Promise(resolve => resolve({elements: []})))
                            ).elements;
                    } catch (err) {
                        pois = [];
                    }
                    right = pois.length > 0;
                } while (!right && ++j < poiDirections.length);
                if (pois.length > 0) {
                    //Find city with max pois
                    pois.sort((a,b) => {
                        a = a.tags["addr:city"].toLowerCase();
                        b = b.tags["addr:city"].toLowerCase();
                        return a < b ? -1 : (a > b ? 1 : 0);
                    });
                    maxMiddlePoint = poisDescriptions ? {
                        details: "",
                        pois: []
                    } : {
                        details: "",
                        nPois: 0
                    }
                    currentMiddlePoint = poisDescriptions ? {
                        details: pois[0].tags["addr:city"],
                        pois: []
                    } : {
                        details: pois[0].tags["addr:city"],
                        nPois: 0
                    }
                    for (const poi of pois) {
                        if (poi.tags["addr:city"] == currentMiddlePoint.details) {
                            if (poisDescriptions) {
                                currentMiddlePoint.pois.push(poi);
                            } else {
                                currentMiddlePoint.nPois++;
                            }
                        } else {
                            if ((poisDescriptions && currentMiddlePoint.pois.length > maxMiddlePoint.pois.length)
                                    || (!poisDescriptions && currentMiddlePoint.nPois > maxMiddlePoint.nPois)) {
                                maxMiddlePoint.details = currentMiddlePoint.details;
                                maxMiddlePoint.pois = currentMiddlePoint.pois;
                            }
                            currentMiddlePoint.details = poi.tags["addr:city"];
                            currentMiddlePoint.pois = [poi];
                        }
                    }
                    if (currentMiddlePoint.details != maxMiddlePoint.details && currentMiddlePoint.pois.length > maxMiddlePoint.pois.length) {
                        maxMiddlePoint.details = currentMiddlePoint.details;
                        maxMiddlePoint.pois = currentMiddlePoint.pois;
                    }
                    stops.intermediates[i] = maxMiddlePoint;
                } else {
                    stops.intermediates.splice(i--,1);
                }
            }
            //Convert city name to a point
            for (i = 0; i < stops.intermediates.length; i++) {
                stops.intermediates[i].details = (await request(OSM_TOOLS_URL + "/v1/routing/geocode?limit=1&address=" + stops.intermediates[i].details)
                .then(response => JSON.parse(response))).hits[0];
            }
        } catch (error) {
            stops.intermediates = null;
        }
    } else {
        stops.intermediates = null;
    }

    return stops;
}