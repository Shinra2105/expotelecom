
const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const PASSWORD = "expotelco2025";

// Middleware para servir archivos estáticos y JSON
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Página admin protegida por contraseña en query param
app.get('/admin', (req, res) => {
  if (req.query.pass !== PASSWORD) {
    return res.status(403).send('Acceso denegado');
  }
  res.sendFile(__dirname + '/public/admin.html');
});

// Subida de archivos
app.post('/upload', upload.single('archivo'), (req, res) => {
  if (req.body.password !== PASSWORD) {
    return res.status(403).send('Contraseña incorrecta');
  }
  res.redirect('/admin?pass=' + PASSWORD);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
