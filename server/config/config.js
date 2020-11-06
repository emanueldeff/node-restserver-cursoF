//===========================
// PUERTO
//===========================

process.env.PORT = process.env.PORT || 3000;

//===========================
// BASE DE DATOS
//===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://strider:9LDBiqfsUpVSF66t@cluster0.rpgf2.mongodb.net/cafe'
}

process.env.URLDB = urlDB;