'use strict'

const cors = require('cors');
const authRoutes = require('./auth/auth.routes');
const express = require('express');
const properties = require('./config/properties');
const DB = require('./config/db');
const bodyParser = require('body-parser');

// Inicializar db
DB();

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use('/api', router);

authRoutes(router);

router.get('/', (req, res) => {

    res.send('Hola desde la home');

});

app.use(router);

app.listen(properties.PORT, () => console.log("Servidor corriendo en puerto " + properties.PORT));

