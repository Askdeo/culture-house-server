const Sequelize = require('sequelize');

const sequelize = new Sequelize('culture-house', 'root', 'avokado1', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;