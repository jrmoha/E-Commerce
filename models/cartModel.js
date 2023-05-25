import connection from "./DB.js";
export const cartItems = async (user_id) => {
    try {
        let query = `SELECT p.product_id,p.product_title,p.product_price,i.img_src FROM cart_product c `;
        query += `INNER JOIN product p ON p.product_id=c.product_id INNER JOIN product_image i ON i.product_id=c.product_id `;
        query += `WHERE c.user_id=?;`;
        const result = await connection.query(query, [user_id]);
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const cartCount = async (user_id) => {
    try {
        const cartCountQuery = `SELECT COUNT(user_id) AS 'count' FROM cart_product WHERE user_id=?;`;
        const count = await connection.query(cartCountQuery, [user_id]);
        return count[0][0].count;
    } catch (err) {
        throw err;
    }
};
export const cartItemsAsArray = async (user_id) => {
    try {
        const alreadyInCartQuery = `SELECT product_id FROM cart_product WHERE user_id=?`;
        const alreadyInCart = await connection.query(alreadyInCartQuery, [user_id]);
        const finalAlreadyInCart = alreadyInCart[0].map((obj) => {
            return obj.product_id;
        });
        return finalAlreadyInCart;
    } catch (err) {
        throw err;
    }
};
export const addToCart = async (user_id, prod_id) => {
    try {
        const query = `SELECT * FROM cart WHERE user_id=?;`;
        const result = await connection.query(query, [user_id]);
        let insert_query = ``;
        if (result[0].length == 0) {
            insert_query += `INSERT INTO cart (user_id) VALUES (?);`
            insert_query += `INSERT INTO cart_product (user_id,product_id) VALUES (?,?);`;
            await connection.query(insert_query, [user_id, user_id, prod_id]);
        } else {
            insert_query += `INSERT INTO cart_product (user_id,product_id) VALUES (?,?);`;
            await connection.query(insert_query, [user_id, prod_id]);
        }
        return true;
    } catch (err) {
        throw err;
    }
};
export const deleteFromCart = async (user_id, prod_id) => {
    let query = `DELETE FROM cart_product WHERE user_id=? AND product_id=?;`;
    await connection.query(query, [user_id, prod_id]);
    return true;
};