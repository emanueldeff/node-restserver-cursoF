const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//====================
// Obtener productos
//====================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: termino })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    productos
                })
            }
        })
})

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })

})

app.get('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Id no existe'
                    }
                })
            }

            if (!productoBD) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'producto no existe'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoBD
            })
        })

})

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,

    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoBD
        })
    })

})

app.put('/productos/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(d, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcion;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: false,
                producto: productoGuardado
            });
        })

    })


})

app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        productoBD.disponible = false;

        productoBD.save((err, productoBorrado) => {

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            })
        })
    })
})

module.exports = app;