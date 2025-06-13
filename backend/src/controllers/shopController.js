import Shop from '../models/Shop.js';
import User from '../models/User.js';

// Criar uma nova loja
export const createShop = async (req, res) => {
    try {
        const { userId, name, ownerName, phone, description, logo } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        }

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
};

// Listar todas as lojas
export const getAllShops = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortOption = req.query.sort;
        const search = req.query.search || "";

        let sortBy = {};
        switch (sortOption) {
            case "nome_az":
                sortBy = { name: 1 };
                break;
            case "nome_za":
                sortBy = { name: -1 };
                break;
            case "mais_recente":
                sortBy = { createdAt: -1 };
                break;
            case "mais_antigo":
                sortBy = { createdAt: 1 };
                break;
            default:
                sortBy = { createdAt: -1 };
        }

        const shops = await Shop.find({
            name: { $regex: search, $options: "i" },
        })
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .populate('user');

        const totalShops = await Shop.countDocuments({
            name: { $regex: search, $options: "i" },
        });

        res.json({ shops, totalShops });
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
        delete req.body.user;

        const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Loja não encontrada' });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
};

// Editar banner da loja
export const updateShopBanner = async (req, res) => {
    try {
        const { title, description, link, buttonText } = req.body;

        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Loja não encontrada' });
        }

        shop.banner = {
            title,
            description,
            link,
            buttonText,
            image: req.file ? `/api/files/${req.file.filename}` : shop.banner?.image || ''
        };

        await shop.save();

        res.json(shop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};