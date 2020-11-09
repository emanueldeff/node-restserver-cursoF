require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;

        console.log('Base de datos ONLINE');
    });

app.use(require('./routers/index'));

app.listen(process.env.PORT, () => {
    console.log('console en el puerto ' + process.env.PORT);
});