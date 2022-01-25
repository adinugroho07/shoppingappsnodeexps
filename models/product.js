const Sequelize = require('sequelize');
const objSequelize = require('../util/database');

/*
objSequelize.define('nama table',{table structure}). contoh nya ada di bawah ini.
*/
const Product = objSequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {type: Sequelize.STRING},
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageurl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;