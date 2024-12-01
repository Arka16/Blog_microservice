import express from "express";
import bodyParser from "body-parser";
import cors from "cors"

const app = express()

app.use(cors())
app.use(bodyParser.json())


const posts = {}
app.post("/events", (req, res) => {
    const { type, data } = req.body
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

    console.log(posts)
    res.send({})
})
app.get("/posts", (req, res) => {
    res.send(posts)

})
app.listen(4002, () => {
    console.log("listening on port 4002")
})