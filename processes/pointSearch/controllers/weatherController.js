'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Error code: 500
}


const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.current = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const city=req.query.city;
    const response = await fetch("https://api.weatherbit.io/v2.0/current?city="+city+"&key="+process.env.WEATHER_API_KEY+"&lang=it");
    const data = await response.json();
    //adapter
    const desc = data.data[0].weather["description"];

    res.status(200).json({
        success: true,
        text: 'current weather in '+req.query.city+' is '+desc,
        message: desc
    });
};

module.exports.forecast = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const city=req.query.city;
    const response = await fetch("https://api.weatherbit.io/v2.0/forecast/daily?city="+city+"&key="+process.env.WEATHER_API_KEY+"&lang=it");
    const data = await response.json();
    const array = [];
    var forecasts = "In the next 16 days, in "+city+" the weather will be:"

    data.data.forEach((item, i) => {
      array[i]=item.weather["description"];
      forecasts+=" on day "+i+", "+array[i]+'\n'
    });

    res.status(200).json({
        success: true,
        text: forecasts,
        message: array
    });
};
