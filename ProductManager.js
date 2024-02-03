const fs = require ('fs/promises');

const Joi = require ('./node_modules/joi');

class Product {
  constructor (
    id,
    title,
    descripcion,
    precioUnitario,
    rutaImagen,
    codigoIdentificador,
    cantidad
  ) {
    this.id = id || 0;
    this.title = title;
    this.description = descripcion;
    this.price = precioUnitario;
    this.thumbnail = rutaImagen;
    this.code = codigoIdentificador;
    this.stock = cantidad;
  }
}

class ProductManager {
  constructor (path) {
    this.pathDB = path;
  }

  async addProducto (producto) {
    try {
      //valido si la info del usuario es correcta
      const validation = await this.validarProducto (producto);
      const {error, value} = validation;
      if (error) {
        return null;
      }
      const {title, description, price, thumbnail, code, stock} = producto;
      const allProducts = await this.getProducts ();
      const lastId = allProducts.length === 0
        ? 1
        : allProducts.productos[allProducts.productos.length - 1].id + 1;
      console.log ('🚀 ~ ProductManager ~ addProducto ~ lastId:', lastId);
      //encriptacion

      const productToInsert = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      const newProduct = {id: lastId, ...productToInsert};
      console.log ('🚀 ~ ProductManager ~ addProducto ~ lastId:', lastId);
      allProducts.productos.push ({id: lastId, ...productToInsert});

      await fs.writeFile (this.pathDB, JSON.stringify (allProducts));
      return newProduct;
    } catch (error) {
      console.log ('🚀 ~ ProductManager ~ addProducto ~ error:', error);
    }
  }

  async addProductoNoRepiteCode (id, producto) {
    try {
      const productoAux = this.mapProduct.get (id);
      if (productoAux) {
        console.log ('Producto repetido');
      } else {
        this.addProducto (producto);
      } // Implementa la lógica según sea necesario
    } catch (error) {
      console.log ('🚀 ~ ProductManager ~ addProducto ~ error:', error);
    }
  }

  async validarProducto (producto) {
    try {
      const schema = Joi.object ({
        title: Joi.string ().required (),
        description: Joi.string ().required (),
        price: Joi.number ().required (),
        thumbnail: Joi.string ().required (),
        code: Joi.string ().required (),
        stock: Joi.number (),
      });
      return await schema.validateAsync (producto);
    } catch (error) {
      throw new Error (error);
    }
  }

  async getProducts () {
    try {
      const allProducts = await fs.readFile (this.pathDB);
      return JSON.parse (allProducts);
    } catch (error) {
      console.log ('🚀 ~ ProductManager ~ getProducts ~ error:', error);
    }
  }

  async buscarProductoPorId (idBuscado) {
    try {
      // Leer el contenido del archivo JSON
      const jsonString = await fs.readFile (this.pathDB, 'utf-8');

      // Parsear el JSON
      const data = JSON.parse (jsonString);

      // Verificar si el producto con el ID existe
      if (data.productos[idBuscado]) {
        const productoEncontrado = {
          id: idBuscado,
          ...data.productos[idBuscado],
        };
        console.log ('Producto encontrado:', productoEncontrado);
      } else {
        console.log ('Producto no encontrado.');
      }
    } catch (error) {
      console.error ('Error al leer o procesar el archivo JSON:', error);
      console.error (error.stack);
    }
  }
  async updateProducto (
    idBuscado,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) {
    try {
      // Leer el contenido del archivo JSON
      const jsonString = await fs.readFile (this.pathDB, 'utf-8');

      // Parsear el JSON
      const data = JSON.parse (jsonString);

      // Verificar si el producto con el ID existe
      if (data.productos[idBuscado]) {
        const productoEncontrado = {
          id: idBuscado,
          ...data.productos[idBuscado],
        };
        console.log ('Producto encontrado:', productoEncontrado);
        const productToModify = {
          idBuscado,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        const jsonActualizado = JSON.stringify (data, null, 2);
        console.log (
          '🚀 ~ ProductManager ~ updateProducto ~ newProduct:',
          newProduct
        );
        //allProducts.productos. ({id: lastId, ...productToInsert});

        await fs.writeFile (this.pathDB, jsonActualizado);
      } else {
        console.log ('Producto no encontrado.');
      }
    } catch (error) {
      console.error ('Error al leer o procesar el archivo JSON:', error);
      console.error (error.stack);
    }

    async function eliminarProductoPorId (idEliminar) {
      try {
        // Leer el contenido del archivo JSON
        const jsonString = await fs.readFile ('productos.json', 'utf-8');

        // Parsear el JSON
        const data = JSON.parse (jsonString);

        // Verificar si el producto con el ID existe
        if (data.productos[idEliminar]) {
          // Eliminar el objeto del contenido
          delete data.productos[idEliminar];

          // Convertir el objeto actualizado a una cadena JSON
          const jsonActualizado = JSON.stringify (data, null, 2);

          // Escribir el contenido actualizado de vuelta al archivo JSON
          await fs.writeFile ('productos.json', jsonActualizado, 'utf-8');

          console.log ('Producto eliminado correctamente.');
        } else {
          console.log ('Producto no encontrado.');
        }
      } catch (error) {
        console.error ('Error al leer o procesar el archivo JSON:', error);
        console.error (error.stack);
      }
    }
  }
}

module.exports = ProductManager;
