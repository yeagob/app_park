const { verifyToken } = require('../utils/auth');

// Middleware para verificar autenticación
async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
    }

    const user = await verifyToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Añadir usuario al request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error al verificar autenticación' });
  }
}

// Middleware opcional - permite pasar sin token pero añade user si existe
async function optionalAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const user = await verifyToken(token);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error('Error en autenticación opcional:', error);
    next();
  }
}

module.exports = {
  authenticate,
  optionalAuth
};
