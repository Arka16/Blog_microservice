import express from "express"
import axios from "axios"
import bodyParser from "body-parser"


const app = express()
app.use(bodyParser.json())


const events = []
app.post("/events", (req, res) => {

    const event = req.body
    events.push(event)

    try {
        axios.post("http://posts-clusterip-srv:4000/events", event)
        axios.post("http://comments-clusterip-srv:4001/events", event)
        axios.post("http://query-clusterip-srv:4002/events", event).catch((err) => console.log(err.message))
        axios.post("http://moderation-clusterip-srv:4003/events", event)

    } catch (error) {
        console.log(error.message)

    }
    console.log(events)
    res.send({ status: "OK" })
})

app.get("/events", (req, res) => {
    res.send(events)

})
app.listen(4005, () => {
    console.log("Listening in port 4005")
})