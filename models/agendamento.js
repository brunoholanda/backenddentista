const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Modifique este caminho para apontar ao seu arquivo database.js

class Agendamento extends Model {}

Agendamento.init({
    nome: DataTypes.STRING,
    data: DataTypes.DATEONLY,
    horario: DataTypes.TIME,
    planoDental: DataTypes.STRING,
    celular: DataTypes.STRING,
    motivo: DataTypes.STRING,
    cpf: DataTypes.STRING,
    infoAdicional: DataTypes.TEXT,
    status: DataTypes.STRING  // Você pode precisar ajustar o tipo aqui conforme sua implementação
}, {
    sequelize,
    modelName: 'agendamento',
    tableName: 'agendamentos'
});

module.exports = Agendamento;
