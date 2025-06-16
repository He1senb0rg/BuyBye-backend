import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role }; 
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  } else {
    res.status(401).json({ error: 'Não autorizado, token ausente' });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };