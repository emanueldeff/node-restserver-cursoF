const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const app = express();

const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {

    let body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    })
})

//configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
}
verify().catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.token;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                e
            })
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe sar su autenticacion normal'
                    }
                })
            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            }
        } else {
            // si el usuario no existe en nuestra bd
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }

    })
});

















module.exports = app;