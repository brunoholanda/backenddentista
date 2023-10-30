require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Carregando rotas
const authenticationRoutes = require('./routes/authentication');
const agendamentosRoutes = require('./routes/agendamentos/routes');
const disabledDatesRoutes = require('./routes/disabledDates/routes');
const diasSemanaisRoutes = require('./routes/dias-semanais/routes');

app.use('/api/auth', authenticationRoutes);
app.use('/agendamentos', agendamentosRoutes);
app.use('/disabledDates', disabledDatesRoutes);
app.use('/dias-semanais', diasSemanaisRoutes);

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
