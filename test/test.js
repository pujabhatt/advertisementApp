let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
var mocha = require('mocha')
var describe = mocha.describe;
var it = mocha.it;
chai.use(chaiHttp);



describe('POST request for ads', () => {
  it('post a valid input and should get valid output ', (done) => {
    let ad = {
      "site": {
        "id": "foo123",
        "page": "http://www.foo.com/why-foo"
      },
      "device": {
        "ip": "69.250.196.118"
      },
      "user": {
        "id": "9cb89r"
      }
    }


    chai.request(app)
      .post('/api/augmentAds/')
      .send(ad)
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('publisher');
        res.body.demographics.should.have.property('female_percent');
        res.body.demographics.should.have.property('male_percent');
        res.body.device.should.have.property('geo');
        res.body.device.geo.should.have.property('country');
        done();
      });
  })

  it('post an input with Ip address outside the US and should return 400 status ', (done) => {
    let ad = {
      "site": {
        "id": "foo123",
        "page": "http://www.foo.com/why-foo"
      },
      "device": {
        "ip": "42.110.198.206"
      },
      "user": {
        "id": "9cb89r"
      }
    }


    chai.request(app)
      .post('/api/augmentAds/')
      .send(ad)
      .end((err, res) => {
        console.log(res.body)
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  })

})
