const express = require('express');
const app = express(); 

const path = require('path'); 
const db = require('./db');

const collection = 'todo';

db.connect((err) => {
    if(err) {
        console.log('Unable to connect to database'); 
        process.exit(1);
    } else {
        app.listen(3000, () => {
            console.log('Listening on port 3000');
        })
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getTodos', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if(err) {
            console.log(err);
        } else {
            console.log(documents);
            res.json(documents);
        }
    });
});