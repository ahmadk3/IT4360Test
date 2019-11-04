const bcrypt = require('bcryptjs');
var mysql = require('mysql');

class User {
    constructor(name, email, password) {
        this.name = name || '';
        this.email = email;
        this.password = password;
    }

    async storeUser() {   
        var user = this;
        try {
            var con = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "123123",
                database: "blog"
            });
            
            await con.connect(async function(err) {
                if (err) throw err;
            });

            await bcrypt.hash(user.password, 10, async function(err, hash) {  
                var query = `INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${hash}');`
                await con.query(query, function (err, result) {                
                    if (err) throw err;
                });
            });
        } catch(e) {
            console.log(e);
        }
        
    }

    async findUser(callback) {
        var user = this;
        try {
            var con = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "123123",
                database: "blog"
            });
            
            await con.connect(async function(err) {
                if (err) throw err;
            });

            await bcrypt.hash(user.password, 10, async function(err, hash) {  
                var query = `SELECT * FROM users WHERE  email = '${user.email}';`
                await con.query(query, function (err, result) {                
                    callback(err, result);
                });
            });
        } catch(e) {
            console.log(e);
        }
    }

     async comparePassword(storedPassword, callback) {
        var result = await bcrypt.compare(this.password, storedPassword);
        callback(result);
    };
}

module.exports = User;