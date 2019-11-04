//index, show, store, update, destroy
const User = require('../models/User');
var jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res) {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        

        var error = false;
        var statusCode = 200;

        if(!email || !name || !password) {
            error = true;
            statusCode = 401;
        } else {
            if(name.length > 150 || email.length > 200 || password.length > 20 || password.length < 8 || !emailRegex.test(email)) {
                error = true;
                statusCode = 401;
            }
        }

        const user = new User(name, email, password);

        await user.findUser(async (err, result) => {

            if(result.length) {
                res.status(401);
                return res.json({
                    error: true,
                    errorMessage: "User already registered"
                });
            }

            await user.storeUser();

            if(error) {
                return res.json({
                    error: true
                });
            }
            
            return res.json({ 
                name: user.name,
                email: user.email
            });

        });
    },

    async login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        var error = false;
        var statusCode = 200;

        if(!email || !password) {
            error = true;
            statusCode = 401;
        } else {
            if(email.length > 200 || password.length > 20 || password.length < 8 || !emailRegex.test(email)) {
                error = true;
                statusCode = 401;
            }
        }

        const user = new User(null, email, password);

        await user.findUser(async (err, result) => {

            if(!result.length) {
                res.status(401);
                return res.json({
                    error: true,
                    errorMessage: "User not registered"
                });
            } 

            storedHash = result[0].password;
            await user.comparePassword(storedHash, (result) => {
                if(result) {
                    const token = jwt.sign({}, "secretKey", { algorithm: 'HS256'});
                    return res.json({token: token})
                } else {
                    res.status(401);
                    return res.json({
                        error: true,
                        errorMessage: "Invalid credentials"
                    });
                }
            });

        });
        

    }
};