const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');



const passenRoutes = require('./api/routes/passen');
const ridersRoutes = require('./api/routes/riders');
const UserRoutes = require('./api/routes/User');
//const auth = require('./api/routes/auth/auth');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', '*');
    if (req.method === "OPTIONS"){
      res.header('Access-Control-Allow-Methods', 'PUT, POST , PATCH, GET, DELETE');
        return res.status(200).json({}) 
    };
    next();
});

app.use('/passen', passenRoutes);
app.use('/riders', ridersRoutes);
app.use('/User', UserRoutes);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500).json({
        message: error.message 
    });
});


module.exports = app;