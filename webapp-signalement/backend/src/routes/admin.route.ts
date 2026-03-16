import express, { Response } from "express";
import { authenticate } from "../middleware/auth.middleware";

const route = express.Router();

route.get("", authenticate, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const { passwordHash, ...safeUser } = req.user;
    
    res.json(safeUser);
});

export default route;