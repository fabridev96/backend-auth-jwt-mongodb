const mongoose = require('mongoose');

const dbURL = require('./properties').DB;

module.exports = () => {

    mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Mongodb conectado');
    })
    .catch(err => console.log('Error de conexión a base de datos'));

    process.on('SIGINT', () => {

        mongoose.connection.close(() => {

            console.log('Moongose se ha desconectado');
            process.exit(0);

        });

    });
    

}