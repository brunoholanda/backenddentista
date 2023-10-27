module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('agendamentos', 'cpf', {
      type: Sequelize.STRING(11), // Para armazenar o CPF sem formatação
      allowNull: false,
      unique: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('agendamentos', 'cpf');
  }
};
