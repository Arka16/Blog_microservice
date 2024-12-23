import axios from "axios"
import express from "express"
import bodyParser from "body-parser"

const app = express()
app.use(bodyParser.json())

app.post("/events", async (req, res) => {
    const { type, data } = req.body
    console.log('recieved Event', req.body.type)
    if (type == "CommentCreated") {
        const status = data.content.includes("orange") ? "rejected" : "approved"
        await axios.post("http://event-bus-srv:4005/events", { type: "CommentModerated", data: { id: data.id, content: data.content, postId: data.postId, status } })

    }
    res.send({})




})

app.listen(4003, () => {
    console.log("listening in port 4003")
})