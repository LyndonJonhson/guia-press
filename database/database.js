const Sequelize = require("sequelize");

const connection = new Sequelize('heroku_679b68d4d726364', 'bc473a962f26c8', '8bf549f6',{
    host: 'us-cdbr-east-05.cleardb.net',
    dialect: 'mysql'
});

module.exports = connection;