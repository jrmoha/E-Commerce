import connection from "./DB.js";
const POSTS_NUMBER = 12;
export const category = async () => {
    try {
        const query = `SELECT * FROM category;`;
        const result = await connection.query(query);
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const searchSpecific = async (title) => {
    try {
        let query = `SELECT p.product_id,p.product_title,p.product_price,i.img_src `;
        query += `FROM product p `;
        query += `INNER JOIN product_image i ON i.product_id=p.product_id `;
        query += `WHERE p.product_title LIKE '%${title}%';`;
        const result = await connection.query(query);
        return result[0];
    } catch (err) {
        throw err;
    }
};

export const search = async (search_query) => {
    try {
        let query = `SELECT p.product_id,p.product_title,p.product_price,i.img_src FROM product p `;
        query += `INNER JOIN category_product cp ON cp.product_id=p.product_id `;
        query += `INNER JOIN product_image i ON i.product_id=p.product_id `;
        query += `WHERE p.product_title LIKE '%${search_query}%' OR cp.category_title LIKE '%${search_query}%' `;
        query += `GROUP BY p.product_id;`;
        const products_result = await connection.query(query);
        return products_result[0];
    } catch (err) {
        throw err;
    }
};
export const getProduct = async (prod_id) => {
    try {
        let query = `SELECT p.product_id,p.product_title,p.product_price,i.img_src FROM product p `;
        query += `INNER JOIN product_image i ON p.product_id=i.product_id WHERE p.product_id=?;`;
        const result = await connection.query(query, [prod_id]);
        return result[0][0];
    } catch (err) {
        throw err;
    }
};
export const getRelatedProducts = async (prod_id) => {

    try {
        let query = `SELECT p.product_title,p.product_title,p.product_price,pi.img_src,cp.product_id FROM category_product cp `;
        query += `INNER JOIN product p ON p.product_id=cp.product_id `;
        query += `INNER JOIN product_image pi ON pi.product_id=cp.product_id `;
        query += `WHERE cp.category_title IN (SELECT category_title FROM category_product WHERE product_id=?) GROUP BY cp.product_id ORDER BY RAND() LIMIT 5;`;
        const result = await connection.query(query, [prod_id]);
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const productImgCollection = async (prod_id) => {

    try {
        const collection_query = `SELECT img_src FROM img_collection WHERE product_id=?;`;
        const collection_result = await connection.query(collection_query, [prod_id]);
        return collection_result[0];
    } catch (err) {
        throw err;
    }
};
export const getLikes = async (prod_id) => {
    try {
        const likesQuery = `SELECT COUNT(product_id) AS likes FROM likes WHERE product_id=?;`;
        const likes = await connection.query(likesQuery, [prod_id]);
        return likes[0][0].likes;
    } catch (err) {
        throw err;
    }
};
export const trending = async (order_by, order) => {
    try {
        const weekAgo = (new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString().substring(0, 10);
        let query = `SELECT (SELECT COUNT(product_id) FROM product_view WHERE product_id=p.product_id AND view_date > ? ) AS "Views",`;
        if (order_by == 'likes') {
            query += `(SELECT COUNT(product_id) FROM likes WHERE product_id=p.product_id) AS "Likes",`;
        }
        query += `p.insert_date,p.product_id,p.product_title,p.product_price,i.img_src FROM product p `;
        query += `INNER JOIN product_view pv ON pv.product_id=p.product_id `;
        query += `INNER JOIN product_image i ON i.product_id=p.product_id `;
        if (order_by !== 'likes') {
            query += `GROUP BY (p.product_id) ORDER BY `;
        }
        if (order_by) {
            switch (order_by) {
                case 'price':
                    if (order) {
                        query += `CAST(SUBSTR(p.product_price,2) AS DOUBLE) `;
                        if (order == 'asc') {
                            query += `ASC `;
                        } else if (order == 'desc') {
                            query += `DESC `;
                        }
                    }
                    break;
                case 'likes':
                    query += `GROUP BY (p.product_id) ORDER BY Likes DESC `;
                    break;
                default:
                    query += `Views DESC`;
                    break;
            }
        } else {
            query += `Views DESC`;
        }
        query += ` LIMIT ${POSTS_NUMBER};`
        const result = await connection.query(query, [weekAgo]);
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const getCategory = async (category_title, order_by, order, page_number) => {

    try {
        let query = `SELECT p.product_id,p.product_title,p.product_price,i.img_src FROM product p `;
        query += `INNER JOIN product_image i ON p.product_id=i.product_id `;
        query += `INNER JOIN category_product c ON c.product_id=p.product_id WHERE c.category_title=? ORDER BY `;
        if (order_by) {
            switch (order_by) {
                case 'rand':
                    query += `RAND() `;
                    break;
                case 'price':
                    if (order) {
                        query += `CAST(SUBSTR(p.product_price,2) AS DOUBLE) `;
                        if (order == 'asc') {
                            query += `ASC `;
                        } else if (order == 'desc') {
                            query += `DESC `;
                        }
                    } break;
                default:
                    query += `p.insert_date DESC `;
                    break;
            }
        } else {
            query += `p.insert_date ASC `;
        }
        if (page_number) {
            query += `LIMIT ${(page_number * POSTS_NUMBER) - POSTS_NUMBER},${POSTS_NUMBER};`;
        } else {
            query += `LIMIT ${POSTS_NUMBER};`;
        }
        const result = await connection.query(query, [category_title]);
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const categoryRowsNumber = async (category_title) => {
    try {
        let rows_count_query = `SELECT COUNT(category_title) AS count FROM category_product WHERE category_title=?;`;
        let rows_count = await connection.query(rows_count_query, [category_title]);
        let pag_count = Math.ceil(parseInt(rows_count[0][0].count) / POSTS_NUMBER);
        return pag_count;
    } catch (err) {
        throw err;
    }
};
export const getProducts = async (order_by, order, page_number) => {

    try {
        let query = `SELECT p.product_id,p.product_title,p.product_price,i.img_src,p.insert_date `;
        if (order_by == 'likes') {
            query += `,(SELECT COUNT(product_id) FROM likes WHERE product_id=p.product_id) AS 'Likes' `;
        }
        query += `FROM product p `;
        query += `INNER JOIN product_image i ON p.product_id=i.product_id `;
        if (order_by !== 'likes') {
            query += `ORDER BY `;
        }
        if (order_by) {
            switch (order_by) {
                case 'rand':
                    query += `RAND() `;
                    break;
                case 'price':
                    if (order) {
                        query += `CAST(SUBSTR(p.product_price,2) AS DOUBLE) `;
                        if (order == 'asc') {
                            query += `ASC `;
                        } else if (order == 'desc') {
                            query += `DESC `;
                        }
                    }
                    break;
                case 'likes':
                    query += `GROUP BY (p.product_id) ORDER BY Likes DESC `;
                    break;
                default:
                    query += `p.insert_date DESC `;
                    break;
            }
        } else {
            query += `p.insert_date DESC `;
        }
        if (page_number) {
            query += `LIMIT ${(page_number * POSTS_NUMBER) - POSTS_NUMBER},${POSTS_NUMBER};`;
        } else {
            query += `LIMIT ${POSTS_NUMBER};`;
        }
        const result = await connection.query(query);
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const productsRowsNumber = async () => {

    try {
        let rows_count_query = `SELECT COUNT(product_id) AS count FROM product_image;`;//should be product not product_image just a temp solution
        let rows_count = await connection.query(rows_count_query);
        let pag_count = Math.ceil(parseInt(rows_count[0][0].count) / POSTS_NUMBER);
        return pag_count;

    } catch (err) {
        throw err;
    }
};