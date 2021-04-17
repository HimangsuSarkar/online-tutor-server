const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('admins'));
app.use(fileUpload());

console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yvjlh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const tutorCollection = client.db("onlineTutor").collection("tutors");
    const reviewCollection = client.db("onlineTutor").collection("reviews");
    const enrollCollection = client.db("onlineTutor").collection("enrolls");

    // app.post('/addTutor', (req, res) => {
    //     const tutor = req.body;
    //     tutorCollection.insertOne(tutor)
    //         .then(result => {
    //             res.send(result.insertedCount);
    //         })
    // })
    app.post('/addService', (req, res) => {
        const newServices = req.body;
        console.log('adding new service: ', newServices);
        tutorCollection.insertOne(newServices)
            // res.redirect('/')
            .then(result => {
                res.send(result.insertedCount > 0)

            })
    })

    app.get('/service', (req, res) => {
        tutorCollection.find()
            .toArray((err, service) => {
                res.send(service)
            })
    })

    app.get('/service/:key', (req, res) => {
        tutorCollection.find({ key: req.params.key })
            .toArray((err, service) => {
                res.send(service[0])
            })
    })

    app.post('/addReview', (req, res) => {
        const reviews = req.body;
        reviewCollection.insertOne(reviews)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/review', (req, res) => {
        // console.log(req.query.email);
        reviewCollection.find()
            .toArray((err, review) => {
                res.send(review)
            })
    })

    app.post('/addEnroll', (req, res) => {
        const enrolls = req.body;
        enrollCollection.insertOne(enrolls)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/enroll_list', (req, res) => {
        // console.log(req.query.email);
        enrollCollection.find()
            .toArray((err, enroll_list) => {
                res.send(enroll_list)
            })
    })
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)
