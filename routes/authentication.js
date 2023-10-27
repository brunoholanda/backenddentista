require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'fallbacksecret'; // Melhor armazenar em variáveis de ambiente

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    const userWithoutPassword = { ...user.toJSON(), password: undefined };

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);  
    res.status(500).json({ error: 'Erro ao registrar usuário', message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios' });
      return;
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(400).json({ error: 'Usuário não encontrado' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ error: 'Senha incorreta' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' }); // Token expira em 1 hora

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login', message: error.message });
  }
});

module.exports = router;
