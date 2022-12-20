var Sequelize = require('sequelize');

Sequelize.connectDb = function (connectionString) {
    const sequelize = new Sequelize(
        connectionString.db, 
        connectionString.user, 
        connectionString.pass, 
        connectionString.server);

    return new Promise(function (resolve, reject) {
        sequelize
            .authenticate()
            .then(function (err) {
                
                resolve(sequelize);
            })
            .catch(function (err) {
                reject(err);
            });
    });
}


module.exports = Sequelize;