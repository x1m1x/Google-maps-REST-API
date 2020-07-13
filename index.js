const express = require('express')
const routes = require('./routes/maps_routes')

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())


app.use(routes)
app.use((req, res, next) => {
    res.status(404).send({
        detail: "This page has not found"
    })
})

module.exports = app.listen(PORT, () => {
    console.log("Server has been started...")
})