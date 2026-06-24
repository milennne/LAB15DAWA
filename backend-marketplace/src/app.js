const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const authRoutes = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const { verifyToken } = require('./middleware/auth.middleware');

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // permite peticiones sin origin (Postman, curl) y desde localhost o cualquier *.vercel.app
    if (!origin || origin.includes('localhost') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // en producción real aquí iría: callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true
}));
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