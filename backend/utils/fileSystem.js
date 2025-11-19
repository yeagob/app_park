const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const PARKS_DIR = path.join(DATA_DIR, 'parks');
const PHOTOS_DIR = path.join(DATA_DIR, 'photos');
const COMMENTS_DIR = path.join(DATA_DIR, 'comments');
const BULLETINS_DIR = path.join(DATA_DIR, 'bulletins');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');

// Leer el índice de parques
async function readIndex() {
  try {
    const data = await fs.readFile(INDEX_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { parks: [], lastId: 0 };
  }
}

// Escribir el índice de parques
async function writeIndex(index) {
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
}

// Leer un parque por ID
async function readPark(parkId) {
  const filePath = path.join(PARKS_DIR, `${parkId}.json`);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

// Escribir un parque
async function writePark(parkId, parkData) {
  const filePath = path.join(PARKS_DIR, `${parkId}.json`);
  await fs.writeFile(filePath, JSON.stringify(parkData, null, 2));
}

// Eliminar un parque
async function deletePark(parkId) {
  const filePath = path.join(PARKS_DIR, `${parkId}.json`);
  await fs.unlink(filePath);
}

// Leer todos los parques
async function readAllParks() {
  const index = await readIndex();
  const parks = [];

  for (const parkId of index.parks) {
    try {
      const park = await readPark(parkId);
      parks.push(park);
    } catch (error) {
      console.error(`Error reading park ${parkId}:`, error.message);
    }
  }

  return parks;
}

// Leer comentarios de un parque
async function readComments(parkId) {
  const filePath = path.join(COMMENTS_DIR, `${parkId}_comments.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { parkId, comments: [] };
  }
}

// Escribir comentarios de un parque
async function writeComments(parkId, commentsData) {
  const filePath = path.join(COMMENTS_DIR, `${parkId}_comments.json`);
  await fs.writeFile(filePath, JSON.stringify(commentsData, null, 2));
}

// Crear directorio para fotos de un parque
async function createPhotosDirectory(parkId) {
  const dir = path.join(PHOTOS_DIR, parkId);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  return dir;
}

// Generar nuevo ID de parque
async function generateParkId() {
  const index = await readIndex();
  const newId = index.lastId + 1;
  return `park_${String(newId).padStart(3, '0')}`;
}

// Leer anuncios del tablón de un parque
async function readBulletins(parkId) {
  const filePath = path.join(BULLETINS_DIR, `${parkId}_bulletins.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { parkId, bulletins: [], lastId: 0 };
  }
}

// Escribir anuncios del tablón de un parque
async function writeBulletins(parkId, bulletinsData) {
  const filePath = path.join(BULLETINS_DIR, `${parkId}_bulletins.json`);
  await fs.writeFile(filePath, JSON.stringify(bulletinsData, null, 2));
}

// Generar nuevo ID de anuncio para un parque
async function generateBulletinId(parkId) {
  const bulletinsData = await readBulletins(parkId);
  const newId = bulletinsData.lastId + 1;
  return `bulletin_${String(newId).padStart(3, '0')}`;
}

module.exports = {
  readIndex,
  writeIndex,
  readPark,
  writePark,
  deletePark,
  readAllParks,
  readComments,
  writeComments,
  createPhotosDirectory,
  generateParkId,
  readBulletins,
  writeBulletins,
  generateBulletinId,
  PARKS_DIR,
  PHOTOS_DIR,
  COMMENTS_DIR,
  BULLETINS_DIR
};
