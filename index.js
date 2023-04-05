import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

mongoose.connect("mongodb://localhost:27017/reduxBlogAppDB", options).then(() => {
    console.log("Database Connected")
}).catch(err => {
    console.log("Err Occurred")
})

const postSchema = new mongoose.Schema({
    id: Number,
    title: String,
    body: String
})

const Post = new mongoose.model("Post", postSchema);

app.get("/posts", async (req, res) => {
    // res.send("Redux Blog App API")
    try {
        const posts = await Post.find()
        res.json(posts)
    } catch(err) {
        res.send("Error " + err)
    }
})

app.post("/posts", async (req, res) => {
    const {title, body} = req.body
    const newPost = new Post({
        title,
        body
    })
    try {
        const post = await newPost.save()
        console.log(post)
        res.json(post)
    } catch(err) {
        res.send("Error: " + err)
    }
})

app.get("/posts/:id", async (req, res) => {
    const id = req.params.id
    try {
        const post = await Post.findById(id)
        res.json(post)
    } catch(err) {
        res.send("Error: " + err)
    }
})

app.put("/posts/:id", async (req, res) => {
    const id = req.params.id
    const {title, body} = req.body
    try {
        const post = await Post.findById(id)
        post.title = title
        post.body = body
        const editedPost = await post.save()
        res.json(editedPost)
    } catch(err) {
        res.send("Error: " + err)
    }
})

app.delete("/posts/:id", async (req, res) => {
    const id = req.params.id
    try {
        const post = await Post.findByIdAndRemove(id)
        res.json(post)
    } catch(err) {
        res.send("Error: " + err)
    }
})

app.listen(9000, () => {
    console.log("Server is running at port 9000...")
})