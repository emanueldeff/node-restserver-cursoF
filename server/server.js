require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())



app.get('/usuario', function(req, res) {
    res.json({
        ok: true
    })
})

app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es obligatorio'
        })
    } else {
        res.json({
            body
        })

    }

})

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    })
})

app.delete('/usuario', function(req, res) {
    res.json({
        ok: true
    })
})

app.listen(process.env.PORT, () => {
    console.log('console en el puerto ' + process.env.PORT);
});