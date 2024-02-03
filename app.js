const express = require('express');
const path=require("path");
const handlebars=require("handlebars.js")
const ProductManager = require('./ProductManager'); 

const app = express();
const port = 3000; 
const pathDB = path.join(__dirname, 'db.json');

const productManager = new ProductManager(pathDB);


app.get('/productos', async (req, res) => {
  try {
    const { limit } = req.query;
    const productos = await productManager.getProducts();

    // Aplicar límite si se proporciona
    const productosLimitados = limit ? productos.slice(0, parseInt(limit)) : productos;

    res.json({ productos: productosLimitados });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});