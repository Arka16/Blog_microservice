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
    comments.push({ id: comment_id, content, status: "pending" })
    commentsById[req.params.id] = comments
    await axios.post("http://localhost:4005/events", { type: "CommentCreated", data: { id: comment_id, content, postId: req.params.id, status: "pending" } })
    res.status(201).send({ id: comment_id, content, postId: req.params.id })


})

app.post("/events", async (req, res) => {
    const { type, data } = req.body
    if (type == "CommentModerated") {
        const { id, content, postId, status } = data
        const comments = commentsById[postId]
        const comment = comments.find((comment) => comment.id === id)
        comment.status = status
        await axios.post("http://localhost:4005/events", { type: "CommentUpdated", data: { id, content, postId, status } })
    }
    console.log('recieved Event', req.body.type)
    res.send({})
})

app.get("/posts/:id/comments", (req, res) => {

    res.send(commentsById[req.params.id] || [])

})

app.listen(4001, () => {
    console.log("Listening in 4001")
})