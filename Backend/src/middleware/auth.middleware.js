import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No hay token proporcionado' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

export default authMiddleware;