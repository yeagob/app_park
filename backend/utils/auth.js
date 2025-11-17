const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Leer usuarios
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

// Escribir usuarios
async function writeUsers(usersData) {
  await fs.writeFile(USERS_FILE, JSON.stringify(usersData, null, 2));
}

// Generar token de autenticación
function generateToken() {
  return uuidv4();
}

// Login o registro con email (sin password)
async function loginOrRegister(email) {
  if (!email || !isValidEmail(email)) {
    throw new Error('Email inválido');
  }

  const usersData = await readUsers();
  let user = usersData.users.find(u => u.email === email);

  if (user) {
    // Usuario existente - generar nuevo token
    user.token = generateToken();
    user.lastLogin = new Date().toISOString();
  } else {
    // Nuevo usuario - crear
    user = {
      id: uuidv4(),
      email,
      token: generateToken(),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    usersData.users.push(user);
  }

  await writeUsers(usersData);

  return {
    id: user.id,
    email: user.email,
    token: user.token
  };
}

// Verificar token
async function verifyToken(token) {
  if (!token) {
    return null;
  }

  const usersData = await readUsers();
  const user = usersData.users.find(u => u.token === token);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email
  };
}

// Validar formato de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  loginOrRegister,
  verifyToken,
  generateToken
};
