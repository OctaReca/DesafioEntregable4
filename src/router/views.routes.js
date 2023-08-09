import express from 'express';
import ProductManager from '../controllers/ProductManager.js'

const router = express.Router();
const product = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await product.getProducts();
        res.render("home", { products });
    } catch (error) {
        console.error("Error al obtener los productos: ", error);
        res.status(500).send("Error al obtener los productos");
    }
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await product.getProducts();
    res.render("realTimeProducts", { products });
});

router.post("/products", async (req, res) => {
    const newProduct = await product.addProducts(req.body);
    if (newProduct) {
        req.app.get("socketServer").emit("product_created", newProduct);
        res.json(newProduct);
    } else {
        res.status(500).send({
        status: "error",
        message: "Error al crear el producto",
        })
    }
});
router.delete("/products/:id", async (req, res) => {
    let id = req.params.id;
    const deletedProduct = await product.deleteProducts(id);
    
    if (deletedProduct) {
        req.app.get("socketServer").emit("product_deleted", deletedProduct);
        res.send({
        status: "ok",
        message: "Producto eliminado correctamente",
        deletedProduct: deletedProduct,
        })
    } else {
        res.status(404).send({
        status: "error",
        message: "El producto no existe y no puede ser eliminado",
        });
    }
});

export default router;
