const express = require('express');
const { connectToMongo } = require('./mongoconnect');
const URL = require('./models/url');
const { logReqRes } = require('./middlewares');
const path = require('path');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const cookieParser = require('cookie-parser')
const {checkForAuthentication, restrictTo} = require('./middlewares/auth');

const app = express();
const SERVER_PORT = 8001;

// Mongo DB connection
const MONGO_DB_URL = 'mongodb://127.0.0.1:27017/short-url';
connectToMongo(MONGO_DB_URL)
    .then(() => console.log('Connected to Mongo DB'))
    .catch((error) => console.log('Some error occurred while making connection to Mongo DB.', error));

// EJS Engine
app.set('view engine', 'ejs');

//Set views folder
app.set('views', path.resolve('./views'));

//Logging
app.use(logReqRes('log.txt'));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

//Routes
app.use('/url', restrictTo(['NORMAL', 'ADMIN']), urlRoute);
app.use('/user', userRoute);
app.use('/', staticRoute);

app.get('/test', async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls
    });
});

//Dynamic route
app.use('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    });
    res.redirect(entry.redirectURL);
});



//App Server start.
app.listen(SERVER_PORT, () => console.log(`Server started on port: ${SERVER_PORT}`));