const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

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
    const adminCollection = client.db("onlineTutor").collection("admins");

    app.post('/addAdmin', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        // const filePath = `${__dirname}/admins/${file.name}`;
        // file.mv(filePath, err => {
        //     if (err) {
        //         console.log(err);
        //         res.status(500).send({ msg: 'filled to upload' });
        //     }
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        adminCollection.insertOne({ name, email, image })
            .then(result => {
                fs.remove(filePath, error => {
                    // if (error) {
                    //     console.log(error)
                    //     res.status(500).send({ msg: 'filled to upload' });
                    // }
                    res.send(result.insertedCount > 0);
                    // })

                })
            })
    })



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

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })
});


app.listen(process.env.PORT || port)
