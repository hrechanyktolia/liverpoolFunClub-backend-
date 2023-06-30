import Post from "../models/Post.js";


export const createPost = async (req, res) => {
    try {
        const doc = new Post({
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req._id
        })

        const post = await doc.save()

        res.json(post)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to create post'
        })
    }
}

export const getTags = async (req, res) => {
    try {
        const posts = await Post.find().limit(5).exec()

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

        res.json(tags)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to get tags'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const allPosts = await Post.find().populate('user').exec()

        res.json(allPosts)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to get posts'
        })
    }
}

export const getAllByPopularity = async (req, res) => {
    try {
        const allPosts = await Post.find().populate('user').sort({  viewsCount: -1 }).exec()

        res.json(allPosts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to get posts'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await Post.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {

            },
            {
                returnDocument: 'after',
            }
        );

        if (!doc) {
            return res.status(404).json({
                message: 'Post not found',
            })
        }

        res.json(doc)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to get post',
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await Post.findOneAndDelete(
            {
                _id: postId,
            }
        )
        if (!doc) {
            return res.status(404).json({
                message: 'Failed post'
            })
        }
        res.json({
            success: true
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed delete post',
        });
    }
};


export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id

        await Post.updateOne(
            {
                _id: postId,
            },
            {
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req._id
            }
        )

        res.json({
            success: true
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed update post',
        })
    }
}


export const likePost = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await Post.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { likesCount: 1 },
            },
            {
                new: true,
            }
        );

        if (!doc) {
            return res.status(404).json({
                message: 'Post not found',
            });
        }

        res.json(doc)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Failed to like post',
        });
    }
};


export const addComment = async (req, res) => {
    try {
        const postId  = req.params.id
        const {text, userId, fullName, avatar} = req.body

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({message: 'Post failed'})
        }

        const comment = {
            text: text,
            user: userId,
            fullName: fullName,
            avatar: avatar,
        };

        post.comments.push(comment)

        await post.save()

        return res.status(201).json({message: 'Comment successfully created', comment})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message: 'Server error'})
    }

}







