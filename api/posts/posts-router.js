// implement your posts router here
const express = require('express');
const router = express.Router();
const Posts = require('./posts-model');

//gets all posts
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({
                message: 'the posts information could not be retrieved',
                err: err.message,
                stack: err.stack,
            });
        });
});

//gets post by id
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({message: 'the post with the specified ID does not exist'});
            } else {
                res.json(post);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'the post information could not be retrieved',
                err: err.message,
                stack: err.stack,
            });
        });
});

//posts new post
router.post('/', (req, res) => {
    if(req.body.title === undefined || 
       req.body.contents === undefined ||
       !req.body.title ||
       !req.body.contents) {
           res.status(400).json({message: 'please provide title and contents for the post'});
       } else {
    Posts.insert(req.body)
        .then(post => {
                Posts.findById(post.id)
                    .then(newPost => {
                        res.status(201).json(newPost);
                    });            
        })
        .catch(err => {
            res.status(500).json({
                message: 'there was an error while saving the post to the database',
                err: err.message,
                stack: err.stack
            });
        });
       }
});

//edits existing post
router.put('/:id', async (req, res) => {
    const post = await Posts.findById(req.params.id);
    if (!post) {
        res.status(404).json({message: 'the post with the specified ID does not exist'});
    } else if (req.body.title === undefined ||
               req.body.contents === undefined ||
               !req.body.title ||
               !req.body.contents) {
                   res.status(400).json({message: 'please provide title and contents for post'});
               } else {
                   Posts.update(req.params.id, req.body)
                    .then(updatedPost => {//eslint-disable-line
                        Posts.findById(req.params.id)
                            .then(newPost => {
                                res.json(newPost);
                            })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'the post information could not be modified',
                            err: err.message,
                            stack: err.stack,
                        });
                    });
               }
})

//deletes post
router.delete('/:id', async (req, res) => {
    const deletedPost = await Posts.findById(req.params.id);
    Posts.remove(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({message: 'the post with the specified id does not exist'});
            } else {
                res.json(deletedPost);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'the post could not be removed',
                err: err.message,
                stack: err.stack,
            });
        });
});

//finds post comments
router.get('/:id/comments', async (req, res) => {
    const post = await Posts.findById(req.params.id);
    if (!post) {
        res.status(404).json({message: 'the post with the specified ID does not exist'})
    } else {
    Posts.findPostComments(req.params.id)
        .then(comments => {
                res.json(comments);
        })
        .catch(err => {
            res.status(500).json({
                message: 'the comments information could not be retrieved',
                err: err.message,
                stack: err.stack,
            });
        });
    }
});

module.exports = router;