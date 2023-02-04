'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Error code: 500
}

const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.getBikeNetworks = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const city=req.query.city;
    const response = await fetch("https://api.citybik.es/v2/networks");
    const data = await response.json();
    var result;

    result = data.networks.find(network => network.location.city == req.query.city);

    if (result == undefined) {

      res.status(404).json({
          success: false,
          message: "empty"
      });

    } else {
      res.status(200).json({
          success: true,
          message: result
      });
    }

};
