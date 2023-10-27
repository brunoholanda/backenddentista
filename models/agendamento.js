// models/Agendamento.js
const { Model, DataTypes } = require('sequelize');

class Agendamento extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      cpf: DataTypes.STRING,
      data: DataTypes.STRING,
      horario: DataTypes.STRING,
      planoDental: DataTypes.STRING,
      celular: DataTypes.STRING,
      motivo: DataTypes.STRING
    }, {
      sequelize
    });
  }
}

module.exports = Agendamento;
