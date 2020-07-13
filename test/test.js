const chai = require('chai')
const mocha = require('mocha')
const chaiHttp = require('chai-http')
const server = require('../index')
let describe = mocha.describe

chai.should()

chai.use(chaiHttp)

describe('Main page test', () => {
    describe('GET /api/', () => {
        it('should return "this is main page"', (done) => {
            chai.request(server).get("/api/").end(((err, res) => {
                res.should.have.status(200)
                chai.assert.equal('This is main page', res.body.detail)
                done()
            }))
        })
    })
})

describe('Place finder test', () => {
    describe('GET /api/?query=museum', () => {
        it('should return place id', (done) => {
            chai.request(server).get("/api/?query=museum").end(((err, res) => {
                res.should.have.status(200)
                chai.assert.equal("ChIJH-WXHONugzgRqRb1UoeGy_4", res.body.place_id)
                done()
            }))
        })
    })
})

describe('Place finder test with invalid query', () => {
    describe('GET /api/?query=flkjsd;fjsad', () => {
        it('should return "place has not found"', (done) => {
            chai.request(server).get("/api/?query=flkjsd;fjsad").end(((err, res) => {
                res.should.have.status(404)
                chai.assert.equal("Place has not found", res.body.detail)
                done()
            }))
        })
    })
})

describe('Place detail', () => {
    describe('GET /api/place/ChIJH-WXHONugzgRqRb1UoeGy_4', () => {
        it('should return place details', (done) => {
            chai.request(server).get("/api/place/ChIJH-WXHONugzgRqRb1UoeGy_4").end(((err, res) => {
                res.should.have.status(200)
                chai.assert.equal("https://maps.google.com/?cid=18359916221676459689", res.body.url)
                done()
            }))
        })
    })
})

describe('Place invalid detail', () => {
    describe('GET /api/place/fdsf-WXHONugzgRqRb1UoeGy_4', () => {
        it('should return 404 not found', (done) => {
            chai.request(server).get("/api/place/fdsf-WXHONugzgRqRb1UoeGy_4").end(((err, res) => {
                res.should.have.status(404)
                chai.assert.equal('Place has not found', res.body.detail)
                done()
            }))
        })
    })
})

describe('Place distancematrix', () => {
    describe('GET /api/distancematrix/?origins=place_id:ChIJH-WXHONugzgRqRb1UoeGy_4&destinations=place_id:ChIJE8f2zSVmgzgRQTi0TnOJAJQ', () => {
        it('should return distance between point A and point B', (done) => {
            chai.request(server).get("/api/distancematrix/?origins=place_id:ChIJH-WXHONugzgRqRb1UoeGy_4&destinations=place_id:ChIJE8f2zSVmgzgRQTi0TnOJAJQ").end(((err, res) => {
                res.should.have.status(200)
                chai.assert.equal('12 mins', res.body.distance)
                done()
            }))
        })
    })
})

describe('Place distancematrix invalid', () => {
    describe('GET /api/distancematrix/?origins=place_id:fsd-WXHONugzgRqRb1UoeGy_4&destinations=place_id:ChIJE8f2zSVmgzgRQTi0TnOJAJQ', () => {
        it('should return bad request', (done) => {
            chai.request(server).get("/api/distancematrix/?origins=place_id:fdssfd-WXHONugzgRqRb1UoeGy_4&destinations=place_id:ChIJE8f2zSVmgzgRQTi0TnOJAJQ").end(((err, res) => {
                res.should.have.status(400)
                chai.assert.equal("Bad request", res.body.detail)
                done()
            }))
        })
    })
})

describe('Page not found', () => {
    describe('GET /fsjd', () => {
        it('should return not found', (done) => {
            chai.request(server).get("/fsjd").end(((err, res) => {
                res.should.have.status(404)
                chai.assert.equal("This page has not found", res.body.detail)
                done()
            }))
        })
    })
})
