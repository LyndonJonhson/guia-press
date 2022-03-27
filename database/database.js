const Sequelize = require("sequelize");

const connection = new Sequelize('guiapress', 'root', '020896130597',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;