const sequelize = require('../util/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.userSignup = (req, res, next) => {
    
    //Validation stuff

    
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            return sequelize
            .sync()
            // .sync({force: true})
            .then(result => {
                return User.findOne({ where: { email: email }})
                    .then(user => {
                        if(user) {
                            return res.status(422)
                                .json({message: 'User with this email already exists'})
                        }
                        if(password !== confirmedPassword) {
                            return res.status(422)
                                .json({message: 'Passwords need to be equal'})
                        }
                        return User.create({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            avatar: 'images/dummy-avatar-300x300.jpg'
                        })
                    })
                    .then(user => {
                        res.status(200)
                            .json({message: 'User created successfully', user: user})
                    })
            })
        })
    .catch(err => {
        res.status(422)
            .json({message: 'Something went wrong'})
    });
};

exports.userLogin = (req, res, next) => {
    // Validation stuff

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: {email: email}})
        .then(user => {
            if(!user) {
                return res.status(404)
                    .json({message: 'User with this email does not exist'})
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) {
                        return res.status(401)
                            .json({message: 'Wrong password'})
                    }

                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    };

                    const token = jwt.sign(
                        payload,
                        'secret',
                        { expiresIn: 3600 }
                    );

                    return res.status(200)
                        .json({
                            success: true,
                            token: 'Bearer ' + token
                        });

                });
            
        })
        .catch(err => {
            console.log(err)
            return res.status(400)
            .json({message: 'Could not login, please check your email and password combination'})
        });
};