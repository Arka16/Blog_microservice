import { randomBytes } from "crypto"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors";
const app = express()
app.use(bodyParser.json())
app.use(cors())
const posts = {}
app.get("/posts", (req, res) => {
    res.send(posts)


})

app.post('/posts', (req, res) => {
    console.log("ASDF")
    const id = randomBytes(4).toString('hex')
    const { title } = req.body
    posts[id] = { id, title }
    res.status(201).send(`post created: ${posts}`)

})

app.listen(4000, () => {
    console.log("listening in port 4000")

})