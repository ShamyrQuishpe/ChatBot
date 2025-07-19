import Tradein from '../models/trade_in.js'
import Categories from '../models/category.js';

const agregarTradein = async (req, res) => {
    const {categoriaNombre, nombreEquipo, ...otrosCampos } = req.body;

    if (!nombreEquipo || Object.values(otrosCampos).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const nombreEquipoNormalizado = nombreEquipo.toLowerCase().trim()
    try {

        const existeEquipo = await Tradein.findOne({ nombreEquipo: nombreEquipoNormalizado });
        
        if (existeEquipo) {
        return res.status(400).json({ msg: "Ya existe un producto trade in con ese nombre" });
        }

        const categoria = await Categories.findOne({ nombreCategoria: categoriaNombre });
        console.log(categoria)
        if (!categoria) {
            return res.status(400).json({ msg: "Categoría no encontrada" });
        }

        const nuevoTradein = new Tradein({
            nombreEquipo: nombreEquipoNormalizado,
            ...otrosCampos,
            responsable: {
                id: req.user._id,
                nombre: req.user.nombre
            },
            categoriaNombre: {
                id:categoria._id,
                nombreCategoria: categoriaNombre
            },
        });

        await nuevoTradein.save();

        res.status(200).json({
            msg: "Tradein agregado correctamente",
            producto: nuevoTradein,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al agregar el tradein" });
    }
};

const listarTradein = async (req, res) => {
    try {
        const productos = await Tradein.find();

        if (productos.length === 0) {
            return res.status(404).json({ msg: "No se encontraron resultados del producto trade in" });
        }

        res.status(200).json({ productos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al obtener los productos" });
    }
};

const listarTradeinPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Tradein.findById(id)

        if (!producto) {
            return res.status(404).json({ msg: "Trade in no encontrado" });
        }

        res.status(200).json({ producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al buscar el producto trade in" });
    }
};

const actualizarTradein = async (req, res) => {
    const { id } = req.params;
    const { categoriaNombre, ...otrosCampos } = req.body;

    try {
        const producto = await Tradein.findById(id);

        if (!producto) {
            return res.status(404).json({ msg: "Trade in no encontrado" });
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
            msg: "Trade in actualizado correctamente",
            producto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al actualizar el Trade in" });
    }
};

const eliminarTradein = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Tradein.findByIdAndDelete(id);

        if (!producto) {
            return res.status(404).json({ msg: "Trade in no encontrado" });
        }

        res.status(200).json({ msg: "Trade in eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al eliminar el trade in" });
    }
};

const responderValorTradein = async (nombreEquipo) => {
  try {
    if (!nombreEquipo || nombreEquipo.trim() === '') {
      return `No se proporcionó información sobre un equipo Apple.`;
    }

    // 🔤 Normalizar el texto (minúsculas, sin tildes)
    const nombreNormalizado = nombreEquipo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
      .trim();

    // 📦 Buscar en la base de datos
    const equipo = await Tradein.findOne({
      nombreEquipo: nombreNormalizado
    });

    if (!equipo) {
      return `No encontramos un valor estimado para "${nombreEquipo}". ¿Podrías verificar el modelo?`;
    }

    return `🔁 Aproximadamente podemos recibir tu ${equipo.nombreEquipo} por un valor de $${equipo.valorMinimo} a $${equipo.valorMaximo}. 
Tendrías que cancelar la diferencia para el modelo deseado ✅`;
  } catch (error) {
    console.error('❌ Error en responderValorTradein:', error.message || error);
    return 'Ocurrió un error al procesar tu solicitud. Intenta nuevamente.';
  }
};

export{
    agregarTradein,
    listarTradein,
    listarTradeinPorId,
    actualizarTradein,
    eliminarTradein,
    responderValorTradein
}