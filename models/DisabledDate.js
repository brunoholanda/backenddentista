const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Modifique este caminho para o local correto do seu arquivo database.js

class DisabledDate extends Model {}

DisabledDate.init({
    date: DataTypes.DATEONLY
}, {
    sequelize,
    modelName: 'disabledDate',
    tableName: 'disabled_dates'
});

module.exports = DisabledDate;
