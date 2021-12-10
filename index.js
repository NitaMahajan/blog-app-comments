const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.post('/posts/:id/comments', (req, res) => {
    try {
        const commentId = randomBytes(4).toString('hex');
        const postId = req.params.id;
        const comment = req.body.content;
    
        const comments = commentsByPostId[postId] || [];
        comments.push({ id: commentId, comment });
        commentsByPostId[postId] = comments;
    
        axios.post('http://localhost:4005/events', { type: 'CommentCreated', data: { postId, id: commentId, comment }
        });
    
        res.status(201).send(comments);
    }
    catch(error) {
        console.log(error);
        res.status(201).send(comments);
    }
});

app.get('/posts/:id/comments', (req, res) => {
    res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post('/events', (req, res) => {
    console.log('Received event...', req.body);
    res.send({ message: 'OK' });
});

app.listen(4001, () => {
    console.log('App listening on 4001...');
})