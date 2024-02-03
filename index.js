const path=require("path");
const ProductsManager=require('./ProductManager')
const fs = require('fs').promises;

const projectProducts=async()=>{
    console.log("iniciando el proyecto manejador de productos");

    try {
        const pathBase=path.join(__dirname, 'db.json');
        const manager=new ProductsManager(pathBase);
      /*  const products=await manager.getProducts();
        console.log("🚀 ~ projectUsers ~ products:", products)
        */
        const addproduct={
            title :"Lapiz Othello",
            description: "Lapiz Hb",
            price: 22,
            thumbnail: "c:\miruta",
            code: "384747",
            stock: 123,
        };
        
        const newProduct=await manager.addProducto(addproduct);

        if (!newProduct){
            console.log('No se pudo crear el producto, datos errados');

        }
        

        const productoEncontrado=await manager.buscarProductoPorId(2);
        console.log("🚀 ~ projectProducts ~ productoEncontrado:", productoEncontrado)
        
    } catch (error) {
        console.log("🚀 ~ projectProducts ~ error:", error)
        
    }
}

projectProducts();