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

app.post('/disabledDates', async (req, res) => {
  const { date, allDay, startTime, endTime } = req.body;  // Adicione allDay, startTime, endTime

  try {
      const result = await pool.query(
          'INSERT INTO disabled_dates(date, allDay, startTime, endTime) VALUES($1, $2, $3, $4) RETURNING *', 
          [date, allDay, startTime, endTime]
      );
      res.status(200).json(result.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Erro ao inserir data desabilitada.' });
  }
});


app.get('/disabledDates', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM disabled_dates');
      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Erro ao buscar as datas desabilitadas.' });
  }
});

app.delete('/disabledDates/:id', async (req, res) => {
  const id = req.params.id;

  try {
      const result = await pool.query('DELETE FROM disabled_dates WHERE id = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
          res.status(404).json({ success: false, message: 'Data desabilitada não encontrada' });
          return;
      }

      res.status(200).json({ success: true, message: 'Data desabilitada excluída com sucesso' });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Erro ao excluir a data desabilitada.' });
  }
});

// Endpoint para atualizar uma data desabilitada no banco de dados baseado no ID
app.put('/disabledDates/:id', async (req, res) => {
  const id = req.params.id;
  const { date, allDay, startTime, endTime } = req.body;

  try {
      let query = 'UPDATE disabled_dates SET ';
      const params = [];
      let index = 1;

      if (date) {
          query += `date = $${index}, `;
          params.push(date);
          index++;
      }

      if (allDay !== undefined) {
          query += `allDay = $${index}, `;
          params.push(allDay);
          index++;
      }

      if (startTime) {
          query += `startTime = $${index}, `;
          params.push(startTime);
          index++;
      }

      if (endTime) {
          query += `endTime = $${index}, `;
          params.push(endTime);
          index++;
      }

      // Remover a última vírgula e espaço
      query = query.slice(0, -2);
      query += ` WHERE id = $${index} RETURNING *`;
      params.push(id);

      const result = await pool.query(query, params);

      if (result.rowCount === 0) {
          res.status(404).json({ success: false, message: 'Data desabilitada não encontrada' });
          return;
      }

      res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Erro ao atualizar a data desabilitada' });
  }
});

// Rota para adicionar um dia da semana
app.post('/dias-semanais', async (req, res) => {
    const { dia, ativo } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO dias_semanais(dia, ativo) VALUES($1, $2) RETURNING *',
            [dia, ativo]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar dia da semana.' });
    }
});

// Rota para recuperar todos os dias da semana
app.get('/dias-semanais', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM dias_semanais');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar dias da semana.' });
    }
});

// Rota para atualizar um dia da semana por ID
app.put('/dias-semanais/:id', async (req, res) => {
    const id = req.params.id;
    const { ativo, startam, endam, startpm, endpm } = req.body;

    try {
        const result = await pool.query(
            `UPDATE dias_semanais SET 
                ativo = $1,
                startam = $2,
                endam = $3,
                startpm = $4,
                endpm = $5
            WHERE id = $6 RETURNING *`,
            [ativo, startam, endam, startpm, endpm, id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ success: false, message: 'Dia da semana não encontrado' });
            return;
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Erro ao atualizar dia da semana' });
    }
});


// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});