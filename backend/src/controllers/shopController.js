import Shop from '../models/Shop.js';
import User from '../models/User.js';

// Criar uma nova loja
export const createShop = async (req, res) => {
    try {
        const { userId, name, ownerName, phone, description, logo } = req.body;

        // Verifica se o user existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        }

        // Cria a nova loja fofa
        const shop = await Shop.create({
            user: userId,
            name,
            ownerName,
            description,
            phone,
            logo
        });

         
        res.status(201).json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Listar todas as lojas
export const getAllShops = async (req, res) => {
    try {
        const shop = await Shop.find().populate('user');
        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter loja por ID
export const getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('user');
        if (!shop) {
            return res.status(404).json({ message: 'Loja não encontrada' });
        }
        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Atualizar loja
export const updateShop = async (req, res) => {
    try {
        // Garantir que o id de utilizador não pode ser trocado
        delete req.body.user;

        const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Loja não encontrada' });
        }

        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Apagar loja
export const deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndDelete(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Loja não encontrada' });
        }

        res.json({ message: 'Loja apagada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}