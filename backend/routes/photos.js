const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/authMiddleware');
const { readPark, writePark, createPhotosDirectory } = require('../utils/fileSystem');

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const parkId = req.params.parkId || req.body.parkId;
    if (!parkId) {
      return cb(new Error('Park ID is required'));
    }

    try {
      const photosDir = await createPhotosDirectory(parkId);
      cb(null, photosDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: fileFilter
});

// POST /api/photos/:parkId/main - Subir foto principal (requiere autenticación)
router.post('/:parkId/main', authenticate, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna foto' });
    }

    const park = await readPark(req.params.parkId);

    // Si había una foto principal anterior, eliminarla (opcional)
    // const oldMainPhoto = park.photos.main;
    // if (oldMainPhoto) {
    //   const oldPath = path.join(__dirname, '../data/photos', req.params.parkId, oldMainPhoto);
    //   await fs.unlink(oldPath).catch(() => {});
    // }

    park.photos.main = req.file.filename;
    park.updated_at = new Date().toISOString();

    await writePark(req.params.parkId, park);

    res.json({
      message: 'Foto principal subida correctamente',
      filename: req.file.filename,
      url: `/photos/${req.params.parkId}/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error uploading main photo:', error);
    res.status(500).json({ error: 'Error al subir la foto principal' });
  }
});

// POST /api/photos/:parkId/gallery - Añadir foto a la galería (requiere autenticación)
router.post('/:parkId/gallery', authenticate, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna foto' });
    }

    const park = await readPark(req.params.parkId);

    if (!park.photos.gallery) {
      park.photos.gallery = [];
    }

    park.photos.gallery.push(req.file.filename);
    park.updated_at = new Date().toISOString();

    await writePark(req.params.parkId, park);

    res.json({
      message: 'Foto añadida a la galería',
      filename: req.file.filename,
      url: `/photos/${req.params.parkId}/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error uploading gallery photo:', error);
    res.status(500).json({ error: 'Error al subir la foto a la galería' });
  }
});

// DELETE /api/photos/:parkId/gallery/:filename - Eliminar foto de la galería (requiere autenticación)
router.delete('/:parkId/gallery/:filename', authenticate, async (req, res) => {
  try {
    const park = await readPark(req.params.parkId);

    if (!park.photos.gallery) {
      return res.status(404).json({ error: 'No hay galería de fotos' });
    }

    const photoIndex = park.photos.gallery.indexOf(req.params.filename);
    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Foto no encontrada en la galería' });
    }

    // Eliminar del array
    park.photos.gallery.splice(photoIndex, 1);
    park.updated_at = new Date().toISOString();

    await writePark(req.params.parkId, park);

    // Eliminar archivo físico
    const photoPath = path.join(__dirname, '../data/photos', req.params.parkId, req.params.filename);
    await fs.unlink(photoPath).catch(err => console.error('Error deleting file:', err));

    res.json({ message: 'Foto eliminada de la galería' });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    res.status(500).json({ error: 'Error al eliminar la foto' });
  }
});

// GET /api/photos/:parkId - Obtener todas las fotos de un parque
router.get('/:parkId', async (req, res) => {
  try {
    const park = await readPark(req.params.parkId);

    const photos = {
      main: park.photos.main ? `/photos/${req.params.parkId}/${park.photos.main}` : null,
      gallery: park.photos.gallery.map(filename => `/photos/${req.params.parkId}/${filename}`)
    };

    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(404).json({ error: 'Parque no encontrado' });
  }
});

module.exports = router;
