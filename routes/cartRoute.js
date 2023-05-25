import { Router } from "express";
import { getCartItemsController } from "../controller/cartController.js";
const router = Router();

router.get('/cart', getCartItemsController);
export default router;