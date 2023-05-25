import { Router } from "express";
import { addToCartController, deleteFromCartController } from "../controller/cartController.js";
import { addToFavoritesController, deleteFromFavoritesController } from "../controller/favController.js";
import {
    categoryController,
    getProductController,
    productLikeController,
    productsController,
    productUnlikeController,
    searchController,
    searchSpecificController,
} from "../controller/productController.js";


const router = Router();



//done
router.get('/', productsController);
router.get('/:category_title', categoryController);
router.get('/product/:id', getProductController);
router.post('/products/addToCart', addToCartController);
router.post('/products/search', searchController);
router.get('/products/search/specific', searchSpecificController);
router.post('/products/addToFavorites', addToFavoritesController);
router.delete('/products/deleteFromFavorites', deleteFromFavoritesController);
router.delete('/products/delete', deleteFromCartController);
router.post('/products/like', productLikeController);
router.delete('/products/unlike', productUnlikeController);


export default router;
