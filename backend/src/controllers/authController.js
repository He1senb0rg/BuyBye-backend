import User from '../models/User.js';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import pkg2 from 'bcryptjs';
const { compare, hash } = pkg2;

// Registrar novo usuário
export async function register(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    const user = await User.create({ name, email, password, role, phone });

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
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}