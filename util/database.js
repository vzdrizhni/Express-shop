const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-complete', 'root', 'huinya', {dialect: 'mysql'});

module.exports = sequelize;