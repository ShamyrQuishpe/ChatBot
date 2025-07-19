import Categories from '../models/category.js';
import Products from '../models/product.js'

const agregarProducto = async (req, res) => {
    const { codigoBarras, codigoSerial, categoriaNombre, nombreEquipo, ...otrosCampos } = req.body;

    if (Object.values(otrosCampos).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const nombreEquipoNormalizado = nombreEquipo.toLowerCase().trim()

    try {
        const existeEquipo = await Products.findOne({ nombreEquipo: nombreEquipoNormalizado });
                
        if (existeEquipo) {
          return res.status(400).json({ msg: "Ya existe un producto trade in con ese nombre" });
        }
              
        const categoria = await Categories.findOne({ nombreCategoria: categoriaNombre });
        console.log(categoria)
        if (!categoria) {
            return res.status(400).json({ msg: "Categoría no encontrada" });
        }

        const nuevoProducto = new Products({
            ...otrosCampos,
            nombreEquipo: nombreEquipoNormalizado,
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

async function buscarProductoDesdeTexto(nombreEquipo, capacidad, color) {
  const filtro = { estado: 'Disponible' };

  if (nombreEquipo) {
    filtro.nombreEquipo = { $regex: new RegExp(nombreEquipo, 'i') };
  }

  if (capacidad && capacidad.trim() !== '') {
    filtro.capacidad = { $regex: new RegExp(capacidad, 'i') };
  }

  if (color && color.trim() !== '') {
    filtro.color = { $regex: new RegExp(color, 'i') };
  }

  try {
    const producto = await Products.findOne(filtro);
    return producto;
  } catch (error) {
    console.error('Error buscando producto:', error);
    return null;
  }
}

async function buscarModelosSimilaresPorNombre(nombreEquipo) {
  try {
    if (!nombreEquipo || typeof nombreEquipo !== 'string') {
      return 'Por favor proporciona un nombre de modelo válido.';
    }

    const nombreBase = nombreEquipo.trim().toLowerCase().replace(/\s+/g, ' ');
    const regex = new RegExp(`^${nombreBase}`, 'i');

    const productos = await Products.find({
      nombreEquipo: { $regex: regex },
      estado: 'Disponible'
    }).sort({ precio: 1 });

    if (!productos.length) {
      return `Lo siento, no hay productos disponibles para "${nombreEquipo}".`;
    }

    const tipo = productos[0].tipo || 'Desconocido';

    let encabezado = '';
    if (tipo.toLowerCase() === 'nuevo') {
      encabezado = `¡NUEVAS promociones! 🏷️ En modelos completamente *NUEVOS* 🆕\n\n`;
    } else if (tipo.toLowerCase() === 'open box') {
      encabezado = `¡PROMOCIONES! 🔄 Modelos *OPEN BOX* disponibles 🛠️\n\n`;
    } else {
      encabezado = `Modelos disponibles para *${tipo}*\n\n`;
    }

    let lista = '';
    productos.forEach(p => {
      lista += `• ${p.nombreEquipo} ${p.capacidad} $${p.precio}\n`;
    });

    return encabezado + lista.trim();

  } catch (error) {
    console.error('❌ Error buscando modelos similares:', error.message || error);
    return 'Hubo un error al obtener los modelos. Por favor intenta más tarde.';
  }
}


async function obtenerPromocionesPorTipo(tipoModelo) {
  try {
    const productos = await Products.find({ tipo: tipoModelo, estado: 'Disponible' });

    if (productos.length === 0) {
      return `No hay modelos disponibles en la categoría *${tipoModelo}* por ahora.`;
    }

    // Construir el mensaje con formato de lista
    let mensaje = `¡NUEVAS promociones! 🏷️ En modelos completamente *${tipoModelo.toUpperCase()}* 🆕\n\n`;

    productos.forEach(p => {
      mensaje += `• ${p.nombreEquipo} ${p.capacidad} $${p.precio}\n`;
    });

    return mensaje.trim();
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    return 'Lo siento, hubo un error al obtener las promociones. Intenta más tarde.';
  }
}

async function obtenerListaPorModelo(nombreEquipo) {
  try {
    // Buscar todos los productos disponibles que tengan nombreEquipo que contenga el texto (case insensitive)
    const productos = await Products.find({
      nombreEquipo: { $regex: new RegExp(nombreEquipo, 'i') },
      estado: 'Disponible'
    }).sort({ precio: 1 });

    if (!productos.length) {
      return `Lo siento, no hay productos disponibles para "${nombreEquipo}".`;
    }

    // Asumiendo que todos los productos con ese nombreEquipo tienen el mismo tipo
    // Si no, podrías tomar el tipo del primero:
    const tipo = productos[0].tipo || 'Desconocido';

    // Construir mensaje con encabezado basado en el tipo
    let encabezado = '';
    if (tipo.toLowerCase() === 'nuevo') {
      encabezado = `¡NUEVAS promociones! 🏷️ En modelos completamente *NUEVOS* 🆕\n\n`;
    } else if (tipo.toLowerCase() === 'open box') {
      encabezado = `¡PROMOCIONES! 🔄 Modelos *OPEN BOX* disponibles 🛠️\n\n`;
    } else {
      encabezado = `Modelos disponibles para *${tipo}*\n\n`;
    }

    // Crear lista con formato
    let lista = '';
    productos.forEach(p => {
      lista += `• ${p.nombreEquipo} ${p.capacidad} $${p.precio}\n`;
    });

    return encabezado + lista.trim();

  } catch (error) {
    console.error('Error obteniendo lista por modelo:', error);
    return 'Hubo un error al obtener la lista de productos. Por favor intenta más tarde.';
  }
}

export {
    agregarProducto,
    listarProductos,
    listarProductoPorId,
    actualizarProducto,
    eliminarProducto,
    buscarProductoDesdeTexto,
    obtenerPromocionesPorTipo,
    obtenerListaPorModelo,
    buscarModelosSimilaresPorNombre
}