const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yvjlh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const tutorCollection = client.db("onlineTutor").collection("tutors");
    console.log("datebase connect")
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)
