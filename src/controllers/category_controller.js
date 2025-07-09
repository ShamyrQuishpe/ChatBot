import Categories from '../models/category.js'

const crearCategoria = async (req, res) => {
    const { nombreCategoria, descripcionCategoria } = req.body;

    if (!nombreCategoria || !descripcionCategoria) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    try {
        const categoriaExistente = await Categories.findOne({ nombreCategoria: nombreCategoria.trim().toLowerCase() });

        if (categoriaExistente) {
            return res.status(400).json({ msg: "El nombre de la categoría ya existe" });
        }

        const nuevaCategoria = new Categories({ 
            nombreCategoria: nombreCategoria.trim().toLowerCase(), 
            descripcionCategoria 
        });

        await nuevaCategoria.save();

        res.status(200).json({ msg: "Categoría creada correctamente", categoria: nuevaCategoria });

    } catch (error) {
        res.status(500).json({ msg: "Error al crear la categoría", error });
    }
};


const listarCategorias = async (req,res) => {
    try{
        const categorias = await Categories.find();
        res.status(200).json(categorias)
    }catch(error){
        res.status(500).json({msg: "Error al obtener categorias",error})
    }
}

const actualizarCategorias = async (req, res) => {
    const {id} = req.params
    const {nombreCategoria, descripcionCategoria} = req.body

    try{
        const categoria = await Categories.findById(id);
        if(!categoria){
            return res.status(404).json({msg: "Categoria no encontrada"})
        }

        categoria.nombreCategoria = nombreCategoria || categoria.nombreCategoria;
        categoria.descripcionCategoria = descripcionCategoria || categoria.descripcionCategoria;

        await categoria.save()
        res.status(200).json({ msg: "Categoria actualizada correctamente", categoria})
    }catch (error) {
        res.status(500).json({ msg: "Error al actualizar la categoria"})
    }
}

const eliminarCategoria = async (req,res) => {
    const {id} = req.params

    try{
        const categoria = await Categories.findByIdAndDelete(id);
        if(!categoria){
            return res.status(400).json({ msg: "Categoria no encontrada"})
        }
        res.status(200).json({msg: "Categoria eliminada correctamente"})
    } catch(error){
        res.status(500).json({msg:"Error al eliminar la categoria"})
    }
}

export {
    crearCategoria,
    listarCategorias,
    actualizarCategorias,
    eliminarCategoria
}