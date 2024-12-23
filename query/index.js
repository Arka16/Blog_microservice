import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import axios from "axios"

const app = express()

app.use(cors())
app.use(bodyParser.json())
const posts = {}
const handleEvent = (type, data) => {
    if (type === "PostCreated") {
        const { id, title } = data
        posts[id] = { id, title, comments: [] }

    }
    if (type === "CommentCreated") {
        const { id, content, postId, status } = data
        const post = posts[postId]
        post.comments.push({ id, content, status })
    }
    if (type === "CommentUpdated") {
        const { id, content, postId, status } = data
        const post = posts[postId]
        const comment = post.comments.find((comment) => comment.id === id)
        comment.status = status
        comment.content = content
    }
}

app.post("/events", (req, res) => {
    const { type, data } = req.body

    console.log('recieved Event', req.body.type)
    handleEvent(type, data)
    res.send({})
})
app.get("/posts", (req, res) => {
    res.send(posts)

})
app.listen(4002, async () => {
    console.log("listening on port 4002")
    try {
        const res = await axios.get("http://event-bus-srv:4005/events")
        for (let event of res.data) {
            console.log(`processing event ${event.type}`)
            handleEvent(event.type, event.data)

        }

    } catch (error) {
        console.log(error.message)

    }

})