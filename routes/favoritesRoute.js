import { Router } from "express";
import { getFavoritesController } from "../controller/favController.js";
const router = Router();

router.get('/favorites', getFavoritesController);

export default router;