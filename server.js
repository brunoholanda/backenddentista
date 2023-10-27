require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const authenticationRoutes = require('./routes/authentication');
app.use('/api/auth', authenticationRoutes);

// Endpoint para inserir agendamentos no banco de dados
app.post('/agendamentos', async (req, res) => {
  const { nome, data, horario, planoDental, celular, motivo, cpf, infoAdicional } = req.body; // Adicione infoAdicional

  try {
    const result = await pool.query(
      'INSERT INTO agendamentos(nome, data, horario, planoDental, celular, motivo, cpf, infoAdicional) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', 
      [nome, data, horario, planoDental, celular, motivo, cpf, infoAdicional]  // Adicione infoAdicional
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir agendamento no banco de dados.' });
  }
});


// Endpoint para buscar agendamentos por data
app.get('/agendamentos', async (req, res) => {
    const { data } = req.query;
    console.log("Data recebida:", data);  // Log para ver a data que está sendo enviada na requisição
    try {
        const result = await pool.query('SELECT * FROM agendamentos WHERE data = $1', [data]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro ao executar a query:", err);  // Log para capturar e ver qualquer erro da query
        res.status(500).json({ error: 'Erro ao buscar os horários agendados.' });
    }
});

app.get('/todos-agendamentos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM agendamentos');  // Remova a cláusula WHERE
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erro ao executar a query:", err); 
        res.status(500).json({ error: 'Erro ao buscar todos os agendamentos.' });
    }
});

// Endpoint para atualizar agendamentos no banco de dados baseado no ID
app.put('/agendamentos/:id', async (req, res) => {
  const id = req.params.id;
  const { data, horario, status, infoAdicional  } = req.body;

  try {
      let query = 'UPDATE agendamentos SET ';
      const params = [];
      let index = 1;

      if (data) {
          query += `data = $${index}, `;
          params.push(data);
          index++;
      }

      if (horario) {
          query += `horario = $${index}, `;
          params.push(horario);
          index++;
      }

      if (status !== undefined) {
          query += `status = $${index}, `;
          params.push(status);
          index++;
      }

      if (infoAdicional) {
        query += `infoAdicional = $${index}, `;
        params.push(infoAdicional);
        index++;
    }

      // Remover a última vírgula e espaço
      query = query.slice(0, -2);
      query += ` WHERE id = $${index} RETURNING *`;
      params.push(id);

      const result = await pool.query(query, params);

      if (result.rowCount === 0) {
          res.status(404).json({ success: false, message: 'Agendamento não encontrado' });
          return;
      }

      res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Erro ao atualizar o agendamento' });
  }
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
