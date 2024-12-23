import { randomBytes } from "crypto"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors";
import axios from "axios";

const app = express()
app.use(bodyParser.json())
app.use(cors())
const posts = {}
app.get("/posts", (req, res) => {
    res.send(posts)


})

app.post('/posts/create', async (req, res) => {
    console.log("ASDF")
    const id = randomBytes(4).toString('hex')
    const { title } = req.body
    posts[id] = { id, title }
    await axios.post("http://event-bus-srv:4005/events", { type: "PostCreated", data: posts[id] })
    res.status(201).send(`post created: ${posts[id]}`)

})

app.post("/events", async (req, res) => {
    console.log('recieved Event', req.body.type)
    res.send({})
})

app.listen(4000, () => {
    console.log("v55")
    console.log("listening in port 4000")

})