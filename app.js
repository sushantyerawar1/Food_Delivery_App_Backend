const express = require('express');
const cookiePareser = require('cookie-parser');
const app = express();

app.use(cookiePareser());
app.use(express.json());




app.use((req, res, next) => {

    // Set the allowed origins
    res.header('Access-Control-Allow-Origin', '*'); // Replace with your frontend domain

    // Set the allowed methods
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Set the allowed headers
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Allow credentials (cookies, authorization headers) to be sent
    res.header('Access-Control-Allow-Credentials', true);

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }

    next();

});


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

const authRoutes = require('./routes/auth')
const cartRoutes = require('./routes/cartOrderRoutes');
const itemRoutes = require('./routes/items');
const orderRoutes = require('./routes/orders')
const contactRoutes = require('./routes/contact')
const groupOrders = require('./routes/groupOrders')

app.use('/api/auth', authRoutes);
app.use('/api/v1', cartRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/groupOrders',groupOrders);





const errorMiddleWare = require('./middlewares/error');
app.use(errorMiddleWare);

module.exports = app; 