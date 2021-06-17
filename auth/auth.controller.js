const User = require('./auth.dao');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const SECRET_KEY = 'secretKey12346';

exports.createUser = (req, res, next) => {

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    }

    User.create(newUser, (err, user) => {

        console.log("XXXXXXXXX", err);

        if(err && err.code === 11000) return res.status(409).send('El email ya existe');

        if(err) return res.status(500).send('Error de servidor');

        const expiresIn = 24*60*60;

        const accessToken = jwt.sign(
            {
                id: user.id
            },

            SECRET_KEY, 
            
            {
                expiresIn: expiresIn
            }
        );
        
        // Respuesta
        const dataUser = {
            name: user.name,
            email: user.email,
            accessToken: accessToken,
            expiresIn: expiresIn 
        }

        res.send({dataUser});

    });

}

exports.loginUser = (req, res, next) => {

    const UserData = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne({email: UserData.email}, (err, user) => {

        if(err) return res.status(500).send('Error de servidor');

        // Si el e-mail no existe
        if(!user){
            return res.status(409).send({message: 'Algo no está bien.'});
        }

        const resultPassword = bcrypt.compareSync(UserData.password, user.password);
        
        if(resultPassword){

            const expiresIn = 24*60*60;
            
            const accessToken = jwt.sign(
                {
                    id: user.id
                }, 
                SECRET_KEY, 
                {
                    expiresIn: expiresIn
                }
            );

            const dataUser = {

                name: user.name,
                email: user.email,
                accessToken: accessToken,
                expiresIn: expiresIn

            }

            res.send({dataUser});

        }else{

            // Contraseña incorrecta
            return res.status(409).send({message: 'Algo no está bien. 2'});

        }

    });

}