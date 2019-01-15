var express = require('express');
var cluster = require('express-cluster');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const passport = require('passport');
const userRoutes = require('./routes/UserRoutes'); //importing route

mongoose.Promise = global.Promise;

// Worker Function
cluster(function (worker) {

    // Connecting to the database
    mongoose.connect(dbConfig.url, { useNewUrlParser: true })
        .then(() => {
            console.log("Worker #" + worker.id + " Successfully connected to the database");
        }).catch(err => {
            console.log('Could not connect to the database. Exiting now...');
            process.exit();
        });

    var app = express();

    // temporary cors : MUST CHANGE LATER
    app.use(cors())

    //Passport
    app.use(passport.initialize());

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());

    userRoutes(app);

    app.get('/', function (req, res) {
        res.send('Hello from Inscrypt API');
    });

    return app.listen(4000, () => console.log('Instance #' + worker.id + ' running'));

}, { count: 2 })

