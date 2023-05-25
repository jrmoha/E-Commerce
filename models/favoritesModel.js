import connection from "./DB.js";
export const favoritesItems = async (user_id) => {
    try {
        let query = `SELECT p.product_id,p.product_title,p.product_price,i.img_src FROM product p `;
        query += `INNER JOIN product_image i ON p.product_id=i.product_id `;
        query += `INNER JOIN favorites_product f ON f.product_id=p.product_id WHERE f.user_id=?;`;
        const result = await connection.query(query, [user_id]);
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const favoritesItemsAsArray = async (user_id) => {
    try {
        const alreadyInFavQuery = `SELECT product_id FROM favorites_product WHERE user_id=?`;
        const alreadyInFav = await connection.query(alreadyInFavQuery, [user_id]);
        const finalAlreadyInFav = alreadyInFav[0].map((obj) => {
            return obj.product_id;
        });
        return finalAlreadyInFav;
    } catch (err) {
        throw err;
    }
};
export const addToFavorites = async (user_id, prod_id) => {
    try {
        let query = `SELECT * FROM favorites WHERE user_id=?`;
        const result = await connection.query(query, [user_id]);
        let insert_query = ``;
        if (result[0] == 0) {
            insert_query += `INSERT INTO favorites (user_id) VALUES (?);`
            insert_query += `INSERT INTO favorites_product (user_id,product_id) VALUES (?,?);`;
            await connection.query(insert_query, [user_id, user_id, prod_id]);
        } else {
            insert_query += `INSERT INTO favorites_product (user_id,product_id) VALUES (?,?);`;
            await connection.query(insert_query, [user_id, prod_id]);
        }
        return true;
    } catch (err) {
        throw err;
    }
};
export const deleteFromFavorites = async (user_id, prod_id) => {
    try {
        let query = `DELETE FROM favorites_product WHERE user_id=? AND product_id=?;`;
        await connection.query(query, [user_id, prod_id]);
        return true;
    } catch (err) {
        throw err;
    }
};
