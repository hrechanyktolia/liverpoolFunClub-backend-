import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';

import {createPostValidation, loginValidation, registerValidation} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import {getMe, login, register} from "./controllers/userController.js";
import {
    addComment,
    createPost,
    deletePost,
    getAll, getAllByPopularity,
    getOne,
    getTags,
    likePost,
    updatePost
} from "./controllers/postCreateController.js";



mongoose.connect('mongodb+srv://user:25111996@cluster0.vwllfsz.mongodb.net/club?retryWrites=true&w=majority')
    .then(() => console.log("DB is ok"))
    .catch((err) => console.log('DB error', err))


const app = express()


const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        cb(null, 'uploads');
    },
    filename: function (_, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello World")
});

app.post('/login', loginValidation, login)
app.post('/register', registerValidation, register)
app.get('/me', checkAuth, getMe)

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', getAll)
app.get('/posts/popular', getAllByPopularity)
app.get('/posts/tags', getTags)
app.get('/posts/:id', getOne)

app.put("/posts/:id", getOne)
app.put("/posts/:id/like", likePost);

app.post('/posts', checkAuth, createPostValidation, createPost)
app.post('/posts/:id/comments', checkAuth, addComment)
app.delete('/posts/:id', checkAuth, deletePost)
app.patch('/posts/:id', checkAuth, createPostValidation, updatePost)


app.listen(4000, (err) => {
    if (err) return console.log("Server Error")
    console.log("Server OK")
})