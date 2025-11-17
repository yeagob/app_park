const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const parksRouter = require('./routes/parks');
const photosRouter = require('./routes/photos');
const commentsRouter = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (fotos)
app.use('/photos', express.static(path.join(__dirname, 'data/photos')));

// Routes
app.use('/api/parks', parksRouter);
app.use('/api/photos', photosRouter);
app.use('/api/comments', commentsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Parks Social Network API is running' });
});

// Inicializar directorios de datos
async function initializeDataDirectories() {
  const directories = [
    path.join(__dirname, 'data/parks'),
    path.join(__dirname, 'data/photos'),
    path.join(__dirname, 'data/comments')
  ];

  for (const dir of directories) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }

  // Crear index.json si no existe
  const indexPath = path.join(__dirname, 'data/index.json');
  try {
    await fs.access(indexPath);
  } catch {
    await fs.writeFile(indexPath, JSON.stringify({ parks: [], lastId: 0 }, null, 2));
    console.log('Created index.json');
  }
}

// Start server
async function startServer() {
  await initializeDataDirectories();
  app.listen(PORT, () => {
    console.log(`🌳 Parks Social Network API running on http://localhost:${PORT}`);
    console.log(`📁 Data directory: ${path.join(__dirname, 'data')}`);
  });
}

startServer();
