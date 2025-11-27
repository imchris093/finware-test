const dotenv = require('dotenv');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const authRouter = require('./src/routes/auth.js');
const oportunidadesRouter = require('./src/routes/oportunidades.js');
const operacionesRouter = require('./src/routes/operaciones.js');

const app = express();
dotenv.config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Configurar logging según el entorno
if (process.env.NODE_ENV === 'production') {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: process.env.WEBAPP_URL || (process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000'),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/api/v1/auth/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/opportunities', oportunidadesRouter);
app.use('/api/v1/operations', operacionesRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  // En producción, no exponer detalles del error
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  
  // En producción, enviar JSON en lugar de renderizar
  if (req.app.get('env') === 'production') {
    res.json({
      error: err.status === 404 ? 'Not Found' : 'Internal Server Error',
      message: err.status === 404 ? 'The requested resource was not found' : 'An error occurred'
    });
  } else {
    res.render('error');
  }
});

module.exports = app;
