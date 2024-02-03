const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs/promises');
const Joi = require('joi');

const ProductManager = require('./ProductManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 3000;
const pathDB = path.join(__dirname, 'db.json');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

const productManager = new ProductManager(pathDB);

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('addProduct', async (data) => {
    const newProduct = await productManager.addProducto(data);
    socket.emit('productAdded', newProduct);
    io.emit('updateProducts', await productManager.getProducts());
  });
});

app.get('/productos', async (req, res) => {
  try {
    const { limit } = req.query;
    const productos = await productManager.getProducts();

    const productosLimitados = limit ? productos.slice(0, parseInt(limit)) : productos;

    res.json({ productos: productosLimitados });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/realTimeProducts', async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    res.render('realTimeProducts', { productos });
  } catch (error) {
    console.error('Error al obtener productos en tiempo real:', error);
    res.status(500).send('Error interno del servidor');
  }
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});