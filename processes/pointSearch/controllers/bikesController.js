'use strict';

let MSG = {
    badRequest: "Bad Request", //Error code: 400
    serverError: "Server error", //Errorr code: 500
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
    var result=0;

    data.networks.forEach((item, i) => {

      if (data.networks[i].location.city === req.query.city) {
        result=data.networks[i];
      }

    });

    if (result == 0) {

      res.status(404).json({
          success: false,
          message: "No bike sharing in "+req.query.city+" was found"
      });

    } else {
      res.status(200).json({
          success: true,
          message: result
      });
    }

};
