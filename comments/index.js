import { randomBytes } from "crypto"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors";
import axios from "axios"

const app = express()

app.use(bodyParser.json())
app.use(cors())

const commentsById = {}

app.post("/posts/:id/comments", async (req, res) => {
    const { content } = req.body
    const comment_id = randomBytes(4).toString('hex')
    const comments = commentsById[req.params.id] || []
    comments.push({ id: comment_id, content })
    commentsById[req.params.id] = comments
    await axios.post("http://localhost:4005/events", { type: "CommentCreated", data: { id: comment_id, content, postId: req.params.id } })
    res.status(201).send(`Comment created for post ${req.params.id}: ${{ id: comment_id, content, postId: req.params.id }} `)


})

app.post("/events", async (req, res) => {
    console.log('recieved Event', req.body.type)
    res.send({})
})

app.get("/posts/:id/comments", (req, res) => {
    res.send(commentsById[req.params.id] || [])

})

app.listen(4001, () => {
    console.log("Listening in 4001")
})