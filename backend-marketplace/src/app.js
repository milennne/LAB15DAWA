const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const authRoutes = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const { verifyToken } = require('./middleware/auth.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API E-commerce funcionando' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;