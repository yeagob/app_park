const express = require('express');
const router = express.Router();
const { loginOrRegister, verifyToken } = require('../utils/auth');

// POST /api/auth/login - Login o registro con email
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Se requiere un email' });
    }

    const userData = await loginOrRegister(email);

    res.json({
      message: 'Autenticación exitosa',
      user: userData
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(400).json({ error: error.message || 'Error en la autenticación' });
  }
});

// GET /api/auth/verify - Verificar token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No se proporcionó token' });
    }

    const user = await verifyToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    res.json({
      valid: true,
      user
    });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({ error: 'Error al verificar token' });
  }
});

module.exports = router;
