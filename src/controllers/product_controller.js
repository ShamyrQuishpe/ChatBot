import Categories from '../models/category.js';
import Products from '../models/product.js'

const agregarProducto = async (req, res) => {
    const { codigoBarras, codigoSerial, categoriaNombre, ...otrosCampos } = req.body;

    if (Object.values(otrosCampos).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    try {

        const categoria = await Categories.findOne({ nombreCategoria: categoriaNombre });
        console.log(categoria)
        if (!categoria) {
            return res.status(400).json({ msg: "Categoría no encontrada" });
        }

        const nuevoProducto = new Products({
            ...otrosCampos,
            responsable: {
                id: req.user._id,
                nombre: req.user.nombre
            },
            categoriaNombre: {
                id:categoria._id,
                nombreCategoria: categoriaNombre
            },
            estado:"Disponible",
        });

        await nuevoProducto.save();

        res.status(200).json({
            msg: "Producto agregado correctamente",
            producto: nuevoProducto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al agregar el producto" });
    }
};

const listarProductos = async (req, res) => {
    try {
        const productos = await Products.find();

        if (productos.length === 0) {
            return res.status(404).json({ msg: "No se encontraron productos" });
        }

        res.status(200).json({ productos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al obtener los productos" });
    }
};

const listarProductoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Products.findById(id)

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.status(200).json({ producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al buscar el producto" });
    }
};

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { categoriaNombre, ...otrosCampos } = req.body;

    try {
        const producto = await Products.findById(id);

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        if (categoriaNombre) {
            const categoria = await Categories.findOne({ nombreCategoria: categoriaNombre });

            if (!categoria) {
                return res.status(400).json({ msg: "Categoría no encontrada" });
            }

            producto.categoriaNombre = categoria._id;
        }

        Object.assign(producto, otrosCampos);

        await producto.save();

        res.status(200).json({
            msg: "Producto actualizado correctamente",
            producto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al actualizar el producto" });
    }
};

const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Products.findByIdAndDelete(id);

        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.status(200).json({ msg: "Producto eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al eliminar el producto" });
    }
};


export {
    agregarProducto,
    listarProductos,
    listarProductoPorId,
    actualizarProducto,
    eliminarProducto
}