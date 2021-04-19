const express = require('express');
const app = express(); 
app.use(express.json());

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

//get a list of all the todos
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

// add todos to DB
app.post('/', (req, res) => {
    const userInput = req.body; 
    db.getDB().collection(collection).insertOne(userInput, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json({result: result, document: result.ops[0]});
        }
    })
})

//make changes to individual todos
app.put('/:id', (req, res) => {
    const todoID = req.params.id;
    const userInput = req.body; 

    console.log(userInput); 

    db.getDB().collection(collection).findOneAndUpdate({_id: db.getPrimaryKey(todoID)}, {$set: {task: userInput.task}}, {returnOriginal: false}, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});

// delete todo item 
app.delete('/:id', (req, res) => {
    const todoID = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({_id: db.getPrimaryKey(todoID)}, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json(result); 
        }
    });
});