import { cartItemsAsArray, cartCount } from "../models/cartModel.js";
import { favoritesItemsAsArray } from "../models/favoritesModel.js";
import { category, trending, getProduct, getRelatedProducts, productImgCollection, search, getLikes, searchSpecific, getCategory, categoryRowsNumber, getProducts, productsRowsNumber } from "../models/productModel.js";
import { addUserHistory, viewProd, likedProd, likeProd, unlikeProd } from "../models/userModel.js";

export const productLikeController = async (req, res) => {
    const prod_id = req.query.prod_id;
    const user_id = req.session.user_id;
    if (prod_id && user_id) {
        const result = await likeProd(user_id, prod_id);
        res.status(200).send(result);
    } else {
        res.redirect('/');
    }
};

export const productUnlikeController = async (req, res) => {
    const prod_id = req.query.prod_id;
    const user_id = req.session.user_id;
    if (prod_id && user_id) {
        const result = await unlikeProd(user_id, prod_id);
        console.log(result);
        res.status(200).send(result);
    } else {
        res.redirect('/');
    }
};
export const searchSpecificController = async (req, res) => {
    if (req.query.title) {
        const result = await searchSpecific(req.query.title);
        const returnResult = [result];
        if (result.length > 0) {
            if (req.session.user_id) {
                const alreadyInCart = await cartItemsAsArray(req.session.user_id);
                const alreadyInFav = await favoritesItemsAsArray(req.session.user_id);
                returnResult.push({ session: true });
                returnResult.push({ alreadyInCart: alreadyInCart });
                returnResult.push({ alreadyInFav: alreadyInFav });
            } else {
                returnResult.push({ session: false });
            }
            res.status(200).send(returnResult);
        } else {
            res.status(200).send("Couldn't Find Something Matches Your Search.");
        }
    }
}
export const searchController = async (req, res) => {
    const search_query = req.body.search_input;
    if (search_query) {
        const products_result = await search(search_query);
        const category_result = await category();
        let options;
        const user_id = req.session.user_id;
        if (user_id) {
            try {
                const result = await Promise.all([cartCount(user_id), cartItemsAsArray(user_id), favoritesItemsAsArray(user_id), addUserHistory(user_id, search_query)]);
                options = {
                    title: 'Search',
                    category: category_result,
                    products: products_result,
                    session: user_id,
                    count: result[0],
                    alreadyInCart: result[1],
                    alreadyInFav: result[2]
                };
                res.status(200).render('search', options);
            } catch (err) {
                res.status(404).send(err);
            }
        } else {
            options = {
                title: 'Search',
                category: category_result,
                products: products_result,
                session: req.session.user_id,
                count: 0
            };
            res.status(200).render('search', options);
        }
    }
};
export const getProductController = async (req, res) => {
    const prod_id = req.params.id;
    if (prod_id) {
        try {
            const basicResult = await Promise.all([getProduct(prod_id), getRelatedProducts(prod_id), category(), productImgCollection(prod_id), getLikes(prod_id)]);
            const user_id = req.session.user_id;
            if (user_id) {
                const userResult = await Promise.all([likedProd(user_id, prod_id), cartItemsAsArray(user_id), favoritesItemsAsArray(user_id), cartCount(user_id), viewProd(user_id, prod_id)]);
                if (Object.keys(basicResult[0]).length > 0) {
                    const options = {
                        product: basicResult[0],
                        session: user_id,
                        others: basicResult[1],
                        category: basicResult[2],
                        alreadyInCart: userResult[1],
                        alreadyInFav: userResult[2],
                        count: userResult[3],
                        likes: basicResult[4],
                        liked: userResult[0],
                        collection: basicResult[3]
                    };
                    res.status(200).render('product', options);
                } else {
                    return res.status(404).redirect('404');
                }
            } else {
                if (Object.keys(basicResult[0]).length > 0) {
                    const options = {
                        product: basicResult[0],
                        session: user_id,
                        others: basicResult[1],
                        category: basicResult[2],
                        likes: basicResult[4],
                        collection: basicResult[3]
                    };
                    res.status(200).render('product', options);
                } else {
                    return res.status(404).render('404');
                }
            }
        } catch (err) {
            res.status(404).render('404');
        }
    } else {
        res.status(401).json("Cannot Find The Product");
    }
};
export const getTrendingController = async (req, res) => {
    const categories = await category();
    const result = await trending(req.query.order_by, req.query.order);
    if (req.session.user_id) {
        try {
            const promiseResult = await Promise.all([cartItemsAsArray(req.session.user_id), favoritesItemsAsArray(req.session.user_id), cartCount(req.session.user_id)]);
            const options = {
                title: 'Trending',
                category: categories,
                products: result,
                session: req.session.user_id,
                alreadyInCart: promiseResult[0],
                alreadyInFav: promiseResult[1],
                count: promiseResult[2]
            };
            res.status(200).render('index', options);
        } catch (err) {
            return res.status(404).redirect('/404');
        }
    } else {
        const options = {
            title: 'Trending',
            category: categories,
            products: result,
            session: req.session.user_id,
            count: 0
        };
        res.status(200).render('index', options);
    }
};
export const categoryController = async (req, res) => {
    const category_title = req.params.category_title;
    const order_by = req.query.order_by;
    const order = req.query.order;
    const page = req.query.page;
    const user_id = req.session.user_id;
    const category_result = await getCategory(category_title, order_by, order, page);
    const pag_count = await categoryRowsNumber(category_title);
    const categories = await category();//get all main categories
    if (user_id) {
        if (category_result.length == 0) {
            res.status(200).render('404');
        } else {
            const promiseResult = await Promise.all([cartItemsAsArray(user_id), favoritesItemsAsArray(user_id), cartCount(user_id)]);
            const options = {
                title: category_title,
                category: categories,
                products: category_result,
                session: user_id,
                alreadyInCart: promiseResult[0],
                alreadyInFav: promiseResult[1],
                count: promiseResult[2],
                pag: pag_count,
                page_number: page || 1
            };
            res.status(200).render('index', options);
        }
    } else {
        if (category_result.length == 0) {
            res.status(200).render('404');
        } else {
            const options = {
                title: category_title,
                category: categories,
                products: category_result,
                session: user_id,
                count: 0,
                pag: pag_count,
                page_number: page || 1
            };
            res.status(200).render('index', options);
        }
    }
};
export const productsController = async (req, res) => {
    const order_by = req.query.order_by;
    const order = req.query.order;
    const page = req.query.page;
    const user_id = req.session.user_id;
    const products_result = await getProducts(order_by, order, page);
    const pag_count = await productsRowsNumber();
    const categories = await category();//get all main categories
    if (user_id) {
        try {
            const promiseResult = await Promise.all([cartItemsAsArray(user_id), favoritesItemsAsArray(user_id), cartCount(user_id)]);
            const options = {
                title: 'Store',
                category: categories,
                products: products_result,
                session: user_id,
                alreadyInCart: promiseResult[0],
                alreadyInFav: promiseResult[1],
                count: promiseResult[2],
                pag: pag_count,
                page_number: page || 1
            };
            res.status(200).render('index', options);
        } catch (err) {
            res.status(404).redirect('/404');
        }
    } else {
        const options = {
            title: 'Store',
            category: categories,
            products: products_result,
            session: user_id,
            count: 0,
            pag: pag_count,
            page_number: page || 1
        };
        res.status(200).render('index', options);
    }
};