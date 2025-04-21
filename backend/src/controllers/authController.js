import User from '../models/User.js';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import pkg2 from 'bcryptjs';
const { compare, hash } = pkg2;

// Registrar novo usuário
export async function register(req, res) {
  try {
    const { name, email, password, tipo } = req.body;
    
    const userExists = await findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    const user = await create({ name, email, password, tipo });
    
    // Remove a senha do retorno
    user.password = undefined;

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Login do usuário
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    const user = await findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = sign(
      { id: user._id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, tipo: user.tipo } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}