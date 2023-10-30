const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Modifique este caminho para o local correto do seu arquivo database.js

class DiaSemanal extends Model {}

DiaSemanal.init({
    dia: DataTypes.STRING,
    ativo: DataTypes.BOOLEAN
}, {
    sequelize,
    modelName: 'diaSemanal',
    tableName: 'dias_semanais'
});

module.exports = DiaSemanal;
