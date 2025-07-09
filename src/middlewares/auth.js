import jwt from 'jsonwebtoken';
import Clients from '../models/client.js';

const autenticar = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Debe proporcionar un token válido" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Clients.findById(id).lean().select("-password");

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    req.user = usuario;

    console.log("Usuario autenticado:", req.user);

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

export default autenticar;
