const { Router } = require('express')
const { api_key, requests } = require('../config')
const fetch = require('node-fetch')

const router = Router()

function placeDetails(place_id, response) {
    fetch(requests.placeDetails + `?place_id=${place_id}&key=${api_key}`)
        .then(res => res.json())
        .then(res => {
            if (res.result === undefined) {
                response.status(404).send({
                    detail: "Place has not found"
                })
            } else {
                response.send(res.result)
            }
        })
}

function findPlaceID(query, response) {
    fetch(requests.findPlace+`?input=${query}&inputtype=textquery&key=${api_key}`)
        .then(res => res.json())
        .then(res => {
            if (res["candidates"][0]) {
                const place_id = res["candidates"][0]
                response.send(place_id)
            } else {
                response.status(404).send({
                    detail: "Place has not found"
                })
            }
        })

}
class Distance {
    constructor(response) {
        this.origin = response.origin_addresses[0]
        this.destination = response.destination_addresses[0]
        this.distance = response.rows[0].elements[0].duration.text
        this.duration = response.rows[0].elements[0].distance.text
    }
}

function distancematrix(origins, destinations, response) {
    fetch(requests.distanceMatrix+`?origins=${origins}&destinations=${destinations}&key=${api_key}`)
        .then(res => res.json())
        .then(res => {
            try {
                if (res.rows[0].elements[0].status === 'NOT_FOUND') {
                    response.status(404).send({
                        detail: "Not found"
                    })
                } else {
                    const distance = new Distance(res)
                    response.send(distance)
                }
            } catch (e) {
                response.status(400).send({
                    detail: "Bad request"
                })
            }
        })
}

router.get('/api/', (req, res) => {
        const query = req.query.query
        if (query) {
            findPlaceID(query, res)
        } else {
            res.send({
                detail: "This is main page"
            })
        }

})

router.get('/api/place/:id/', (req, res) => {
    placeDetails(req.params.id, res)
})


router.get('/api/distancematrix/', (req, res) => {
        if (req.query.origins && req.query.destinations)
            distancematrix(req.query.origins, req.query.destinations, res)
        else {
            res.status(400).send({
                detail: "Enter origins and destinations"
            })
        }
})

module.exports = router