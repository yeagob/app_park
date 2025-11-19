const express = require('express');
const router = express.Router();
const { readBulletins, writeBulletins, generateBulletinId } = require('../utils/fileSystem');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/bulletins/:parkId - Obtener todos los anuncios del tablón de un parque
router.get('/:parkId', async (req, res) => {
  try {
    const { parkId } = req.params;
    const bulletinsData = await readBulletins(parkId);

    // Filtrar anuncios expirados
    const now = new Date();
    const activeBulletins = bulletinsData.bulletins.filter(
      bulletin => !bulletin.expiresAt || new Date(bulletin.expiresAt) > now
    );

    res.json({
      parkId,
      bulletins: activeBulletins
    });
  } catch (error) {
    console.error('Error fetching bulletins:', error);
    res.status(500).json({ error: 'Error al obtener anuncios del tablón' });
  }
});

// POST /api/bulletins/:parkId - Crear nuevo anuncio en el tablón
router.post('/:parkId', authenticate, async (req, res) => {
  try {
    const { parkId } = req.params;
    const { type, title, description, ageRange, timeRange, contactInfo, daysToExpire } = req.body;

    // Validaciones básicas
    if (!type || !title || !description) {
      return res.status(400).json({
        error: 'Tipo, título y descripción son obligatorios'
      });
    }

    const bulletinsData = await readBulletins(parkId);
    const bulletinId = await generateBulletinId(parkId);

    // Calcular fecha de expiración (por defecto 30 días)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (daysToExpire || 30));

    const newBulletin = {
      id: bulletinId,
      parkId,
      type,
      title,
      description,
      ageRange: ageRange || null,
      timeRange: timeRange || null,
      contactInfo: contactInfo || null,
      createdBy: req.user.email,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    bulletinsData.bulletins.push(newBulletin);
    bulletinsData.lastId += 1;

    await writeBulletins(parkId, bulletinsData);

    res.status(201).json({
      message: 'Anuncio creado exitosamente',
      bulletin: newBulletin
    });
  } catch (error) {
    console.error('Error creating bulletin:', error);
    res.status(500).json({ error: 'Error al crear anuncio' });
  }
});

// PUT /api/bulletins/:parkId/:bulletinId - Editar anuncio existente
router.put('/:parkId/:bulletinId', authenticate, async (req, res) => {
  try {
    const { parkId, bulletinId } = req.params;
    const { type, title, description, ageRange, timeRange, contactInfo } = req.body;

    const bulletinsData = await readBulletins(parkId);
    const bulletinIndex = bulletinsData.bulletins.findIndex(b => b.id === bulletinId);

    if (bulletinIndex === -1) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }

    const bulletin = bulletinsData.bulletins[bulletinIndex];

    // Verificar que el usuario sea el creador del anuncio
    if (bulletin.createdBy !== req.user.email) {
      return res.status(403).json({ error: 'No tienes permiso para editar este anuncio' });
    }

    // Actualizar campos
    if (type) bulletin.type = type;
    if (title) bulletin.title = title;
    if (description) bulletin.description = description;
    if (ageRange !== undefined) bulletin.ageRange = ageRange;
    if (timeRange !== undefined) bulletin.timeRange = timeRange;
    if (contactInfo !== undefined) bulletin.contactInfo = contactInfo;
    bulletin.updatedAt = new Date().toISOString();

    await writeBulletins(parkId, bulletinsData);

    res.json({
      message: 'Anuncio actualizado exitosamente',
      bulletin
    });
  } catch (error) {
    console.error('Error updating bulletin:', error);
    res.status(500).json({ error: 'Error al actualizar anuncio' });
  }
});

// DELETE /api/bulletins/:parkId/:bulletinId - Eliminar anuncio
router.delete('/:parkId/:bulletinId', authenticate, async (req, res) => {
  try {
    const { parkId, bulletinId } = req.params;

    const bulletinsData = await readBulletins(parkId);
    const bulletinIndex = bulletinsData.bulletins.findIndex(b => b.id === bulletinId);

    if (bulletinIndex === -1) {
      return res.status(404).json({ error: 'Anuncio no encontrado' });
    }

    const bulletin = bulletinsData.bulletins[bulletinIndex];

    // Verificar que el usuario sea el creador del anuncio
    if (bulletin.createdBy !== req.user.email) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este anuncio' });
    }

    bulletinsData.bulletins.splice(bulletinIndex, 1);
    await writeBulletins(parkId, bulletinsData);

    res.json({
      message: 'Anuncio eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting bulletin:', error);
    res.status(500).json({ error: 'Error al eliminar anuncio' });
  }
});

module.exports = router;
