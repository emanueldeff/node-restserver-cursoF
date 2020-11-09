//===========================
// PUERTO
//===========================

process.env.PORT = process.env.PORT || 3000;

//===========================
// ENTORNO
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//===========================
// VENCIMIENTO DEL TOKEN
//===========================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//===========================
// SEED DE AUTENTICACIÓN
//===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

//===========================
// BASE DE DATOS
//===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;


//===========================
// GOOGLE CLIENT ID
//===========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '654323570582-vvs86e37mfveamf086n4hf4orm4dqu6s.apps.googleusercontent.com'