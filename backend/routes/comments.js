const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readComments, writeComments } = require('../utils/fileSystem');

// GET /api/comments/:parkId - Obtener todos los comentarios de un parque
router.get('/:parkId', async (req, res) => {
  try {
    const commentsData = await readComments(req.params.parkId);

    // Ordenar comentarios (más recientes primero)
    const sortedComments = commentsData.comments.sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );

    res.json({
      parkId: req.params.parkId,
      total: sortedComments.length,
      comments: sortedComments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// POST /api/comments/:parkId - Añadir un comentario
router.post('/:parkId', async (req, res) => {
  try {
    const { author, text, rating } = req.body;

    if (!author || !text) {
      return res.status(400).json({ error: 'Se requiere autor y texto del comentario' });
    }

    const commentsData = await readComments(req.params.parkId);

    const newComment = {
      id: uuidv4(),
      author,
      text,
      rating: rating || null,
      likes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    commentsData.comments.push(newComment);
    await writeComments(req.params.parkId, commentsData);

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

// PUT /api/comments/:parkId/:commentId - Editar un comentario
router.put('/:parkId/:commentId', async (req, res) => {
  try {
    const commentsData = await readComments(req.params.parkId);
    const commentIndex = commentsData.comments.findIndex(c => c.id === req.params.commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    const { text, rating } = req.body;

    if (text) {
      commentsData.comments[commentIndex].text = text;
    }

    if (rating !== undefined) {
      commentsData.comments[commentIndex].rating = rating;
    }

    commentsData.comments[commentIndex].updated_at = new Date().toISOString();

    await writeComments(req.params.parkId, commentsData);

    res.json(commentsData.comments[commentIndex]);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Error al actualizar comentario' });
  }
});

// DELETE /api/comments/:parkId/:commentId - Eliminar un comentario
router.delete('/:parkId/:commentId', async (req, res) => {
  try {
    const commentsData = await readComments(req.params.parkId);
    const commentIndex = commentsData.comments.findIndex(c => c.id === req.params.commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    commentsData.comments.splice(commentIndex, 1);
    await writeComments(req.params.parkId, commentsData);

    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
});

// POST /api/comments/:parkId/:commentId/like - Dar "me gusta" a un comentario
router.post('/:parkId/:commentId/like', async (req, res) => {
  try {
    const commentsData = await readComments(req.params.parkId);
    const commentIndex = commentsData.comments.findIndex(c => c.id === req.params.commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    commentsData.comments[commentIndex].likes += 1;
    await writeComments(req.params.parkId, commentsData);

    res.json(commentsData.comments[commentIndex]);
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Error al dar me gusta' });
  }
});

// POST /api/comments/:parkId/:commentId/unlike - Quitar "me gusta" de un comentario
router.post('/:parkId/:commentId/unlike', async (req, res) => {
  try {
    const commentsData = await readComments(req.params.parkId);
    const commentIndex = commentsData.comments.findIndex(c => c.id === req.params.commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    if (commentsData.comments[commentIndex].likes > 0) {
      commentsData.comments[commentIndex].likes -= 1;
    }

    await writeComments(req.params.parkId, commentsData);

    res.json(commentsData.comments[commentIndex]);
  } catch (error) {
    console.error('Error unliking comment:', error);
    res.status(500).json({ error: 'Error al quitar me gusta' });
  }
});

module.exports = router;
