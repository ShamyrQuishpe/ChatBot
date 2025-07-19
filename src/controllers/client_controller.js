import Clients from '../models/client.js'
import generarJWT from "../helpers/JWT.js"

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (Object.values(req.body).includes("")) {
      return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const userBDD = await Clients.findOne({ email }).select("+password");

    if (!userBDD) {
      return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }

    const verificarPassword = await userBDD.matchPassword(password);

    if (!verificarPassword) {
      return res.status(400).json({ msg: "Lo sentimos, la contraseña no es correcta" });
    }

    const { nombre, apellido, rol, telefono, area, _id, email: userEmail } = userBDD;

    const token = generarJWT(_id, "usuario");

    res.status(200).json({
      nombre,
      apellido,
      token,
      _id,
      rol,
      email: userEmail,
      telefono,
      area
    });

  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const registroUsuario = async (req, res) => {
  const { cedula, email, nombre, apellido, area, rol, telefono, password } = req.body;

  if (Object.values(req.body).includes("")) {
  return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }
  try {
    
    const existeUsuario = await Clients.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({
        msg: "Lo sentimos, ese email ya está registrado"
      });
    }

    // Crear instancia del modelo
    const nuevoUser = new Clients({
      cedula,
      email,
      nombre,
      apellido,
      area,
      rol,
      telefono,
      password,
       
    });
    console.log(nuevoUser)
    // Encriptar la contraseña usando método del modelo
    nuevoUser.password = await nuevoUser.encrypPassword(password);

    // Guardar usuario
    await nuevoUser.save();

    res.status(200).json({ msg: "Usuario registrado exitosamente" });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      msg: "Error al registrar el usuario", error: error.message
    });
  }
};

const perfilCliente = async (req, res) => {
    try {
        const id  = req.user._id;
    
        const usuario = await Clients.findById(id).select('nombre apellido rol area');
    
        if (!usuario) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}  

const listarUsuarios = async (req,res) => {
    const user = await Clients.find()
    res.status(200).json(user)
}

const nuevaPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { passwordnuevo, repetirpassword } = req.body;

        if (!passwordnuevo || !repetirpassword) {
            return res.status(400).json({ msg: "Debes ingresar y repetir la nueva contraseña" });
        }

        if (passwordnuevo !== repetirpassword) {
            return res.status(400).json({ msg: "Las contraseñas no coinciden" });
        }

        const usuarioBDD = await Clients.findById({ id });

        if (!usuarioBDD) {
            return res.status(404).json({ msg: `No existe un usuario con la cédula ${cedula}` });
        }

        usuarioBDD.password = await usuarioBDD.encrypPassword(passwordnuevo);
        await usuarioBDD.save();

        res.status(200).json({ msg: `Contraseña actualizada correctamente para el usuario con cédula ${cedula}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor al actualizar la contraseña" });
    }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar existencia del usuario
    const user = await Clients.findById(id);
    if (!user) {
      return res.status(404).json({
        msg: `No se encontró un usuario con el ID: ${id}`,
      });
    }

    const { telefono, area, rol, status } = req.body;

    // Validar campos vacíos
    if ([telefono, area, rol, status].some(campo => campo === undefined || campo === "")) {
      return res.status(400).json({
        msg: "Debes llenar todos los campos: teléfono, área, rol y estado",
      });
    }

    // Actualizar el usuario
    await Clients.findByIdAndUpdate(id, { telefono, area, rol, status }, { new: true });

    return res.status(200).json({
      msg: "Usuario actualizado correctamente",
    });

  } catch (error) {

    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({
      msg: "Ocurrió un error interno al intentar actualizar el usuario",
    });

  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Clients.findById(id);

    if (!user) {
      return res.status(404).json({
        msg: `No se encontró un usuario con el ID: ${id}`
      });
    }

    // Eliminar usuario
    await Clients.findByIdAndDelete(id);

    return res.status(200).json({
      msg: "Usuario eliminado correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({
      msg: "Ocurrió un error al intentar eliminar el usuario"
    });
  }
};

export {
    loginUsuario,
    registroUsuario,
    perfilCliente,
    listarUsuarios,
    nuevaPassword,
    actualizarUsuario,
    eliminarUsuario,
}