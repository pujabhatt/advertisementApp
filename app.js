var express = require("express");
var bodyParser = require("body-parser");
// Set up the express app
const app = express();
var request = require("request");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var utils = require('./utils.js');
var constants = require('./constants.js');
const PORT = 5000;
//set geo credentials
const geo = require('geoip2ws')({ userId: constants.userId, licenseKey: constants.licenseKey, service: 'country', requestTimeout: 8000 });

//start of api
app.post('/api/augmentAds', (req, res) => {

  utils.validateInputRequest(req);

  var returnObj = req.body;

  //get country from ip address of device
  geo('country', req.body.device.ip)
    .then(function (response) {
      if (response && response.country) {
        if (response.country.iso_code !== 'US') {
          return res.status(400).send({
            success: 'false',
            message: 'IP Address outside US are not allowed'
          });
        }
        //augument returnObj by adding geo(country) info
        returnObj.device.geo = { country: response.country.iso_code };

        return utils.getPublishersAndDemoGraphics(request, req.body.site.id, returnObj, res);
      }
    }, errorFn)

});

function errorFn(err) {
  console.log(err);
}

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

module.exports = app