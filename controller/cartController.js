import { addToCart, cartItems, deleteFromCart } from "../models/cartModel.js";
import { category } from "../models/productModel.js";
import { favoritesItemsAsArray } from "../models/favoritesModel.js";

export const getCartItemsController = async (req, res) => {
    const user_id = req.session.user_id;
    if (user_id) {
        const result = await Promise.all([cartItems(user_id), category(), favoritesItemsAsArray(user_id)]);
        const options = {
            fav: result[0],
            category: result[1],
            alreadyInFav: result[2]
        };
        res.render('cart', options);
    } else {
        res.redirect("/");
    }
}
export const addToCartController = async (req, res) => {
    if (req.query.product_id && req.session.user_id) {
        const result = await addToCart(req.session.user_id, req.query.product_id);
        res.status(200).send(result);
    } else {
        res.redirect('/');
    }
};
export const deleteFromCartController = async (req, res) => {
    const prod_id = req.query.product_id;
    const user_id = req.session.user_id;
    if (user_id) {
        const result = await deleteFromCart(user_id, prod_id);
        res.status(200).send(result);
    } else {
        res.redirect('/login');
    }
};