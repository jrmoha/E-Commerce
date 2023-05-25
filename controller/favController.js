import { favoritesItems, addToFavorites, deleteFromFavorites } from "../models/favoritesModel.js";
import { category } from "../models/productModel.js";
import { cartCount, cartItemsAsArray } from "../models/cartModel.js";

export const getFavoritesController = async (req, res) => {
    const user_id = req.session.user_id;
    if (user_id) {
        const result = await Promise.all([favoritesItems(user_id), category(), cartCount(user_id), cartItemsAsArray(user_id)]);
        const options = {
            fav: result[0],
            category: result[1],
            count: result[2],
            alreadyInCart: result[3]
        };
        res.render('favorites', options);
    } else {
        res.redirect('/')
    }
}
export const addToFavoritesController = async (req, res) => {
    if (req.query.product_id && req.session.user_id) {
        const result = await addToFavorites(req.session.user_id, req.query.product_id);
        res.status(200).send(result);
    }
    else {
        res.redirect('/');
    }
}
export const deleteFromFavoritesController = async (req, res) => {
    if (req.query.product_id && req.session.user_id) {
        const result = await deleteFromFavorites(req.session.user_id, req.query.product_id);
        res.status(200).send(result);
    }
    else {
        res.redirect('/');
    }
};