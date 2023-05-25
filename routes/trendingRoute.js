import { Router } from "express";
import { getTrendingController } from "../controller/productController.js";
const router = Router();
router.get('/trending', getTrendingController);

export default router;