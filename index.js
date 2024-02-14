const express = require('express');
const app = require('./app');
const mongoose = require('mongoose');
const env = require('dotenv');
var cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Logger = require('./logs/log');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));
env.config();
app.use(cors());
app.use(express.urlencoded({ extended: false }))
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.gra679a.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log(`Database Connected`);
});


app.options("*", cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());


app.listen(process.env.PORT_NUMBER, () => {
    console.log(`server started on http://localhost:${process.env.PORT_NUMBER}`);
})

const logger = new Logger('app.log');
logger.log('Server started');

