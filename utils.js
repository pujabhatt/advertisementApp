var constants = require('./constants.js');

function errorFn(err) {
    console.log(err);
}

module.exports = {
    getPublishers: function (request, siteId) {
        // Setting URL and headers for request
        var url = constants.baseUrl + "publishers/find";
        var data = { q: { "siteID": siteId } };
        var options = {
            "headers": { "content-type": "application/json" },
            "url": url,
            "body": JSON.stringify(data)
        };
        // Return new promise 
        return new Promise(function (resolve, reject) {
            // Do async job
            request.post(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(body));

            });
        })//promise

    },

    getDemoGraphics: function (request, siteId) {
        var url = constants.baseUrl + "sites/" + siteId + "/demographics";
        // Setting URL and headers for request
        var options = {
            "headers": { 'User-Agent': 'request' },
            "url": url
        };
        // Return new promise 
        return new Promise(function (resolve, reject) {
            // Do async job
            request.get(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(body));
            });
        })//promise

    },

    getMaleFemalePercentFromDemoGraphics: function (demographicsData) {
        if (demographicsData && demographicsData.demographics) {
            var femalePercent = Number(demographicsData.demographics.pct_female).toFixed(2);
            var malePercent = (100 - Number(femalePercent)).toFixed(2);
            var ret = {
                demographics: {
                    "female_percent": femalePercent,
                    "male_percent": malePercent
                }
            }
            return ret;
        }

    },

    validateInputRequest: function (req) {
        if (!req.body.site.id) {
            return res.status(400).send({
                success: 'false',
                message: 'site id is required'
            });
        } else if (!req.body.site.page) {
            return res.status(400).send({
                success: 'false',
                message: 'site page is required'
            });
        }
        else if (!req.body.device.ip) {
            return res.status(400).send({
                success: 'false',
                message: 'device ip is required'
            });
        }
    },

    getPublishersAndDemoGraphics: function (request, siteId, returnObj, res) {
        var utils = this;
        var publishersPromise = utils.getPublishers(request, siteId);
        publishersPromise.then(function (publishers) {
            if (!publishers.publisher || (publishers.publisher && !publishers.publisher.id)) {
                return res.status(400).send({
                    success: 'false',
                    message: 'publisher is required'
                });
            }

            var demographicsPromise = utils.getDemoGraphics(request, siteId);
            demographicsPromise.then(function (demographicsData) {
                var demographics = utils.getMaleFemalePercentFromDemoGraphics(demographicsData);
                //augument returnObj by adding publishers info
                returnObj = Object.assign(publishers, returnObj);

                //augument returnObj by adding demographics info
                if (demographics) {
                    returnObj = Object.assign(demographics, returnObj);
                }

                res.setHeader('Content-Type', 'application/json');
                res.send(returnObj);
            }, errorFn)
        }, errorFn)

    }

}
