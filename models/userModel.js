import connection from "./DB.js";
import bcryptjs from 'bcryptjs';

const TIME_OUT = 40000;

export const findUser = async (email) => {
    try {
        const query = "SELECT user_id,username,email,password FROM user WHERE email=?";
        const result = await connection.query(query, [email]);
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const insertUser = async (username, full_name, email, password, birth_date) => {
    try {
        let query = "INSERT INTO user (username,full_name,email,password,birth_date) VALUES (?,?,?,?,?);";
        query += `SELECT user_id,username FROM user WHERE email=?;`;
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const result = await connection.query(query, [username, full_name, email, hashedPassword, birth_date, email]);
        return result;
    } catch (err) {
        throw err;
    }
};
export const insertSession = async (session_id, user_id, ip_address) => {
    try {
        const query = `INSERT INTO user_session(session_id,user_id,ip_address) VALUES(?,?,?)`;
        const result = await connection.query(query, [session_id, user_id, ip_address]);
        return result;
    } catch (err) {
        throw err;
    }
};
export const checkPassword = async (password, hashedPassword) => {
    try {
        const result = await bcryptjs.compare(password, hashedPassword);
        return result;
    } catch (err) {
        throw err;
    }
};
export const updateSession = async (session_id) => {
    try {
        console.log(session_id);
        const query = "SELECT * FROM users_online WHERE session_id=?;";
        const result = await connection.query(query, [session_id]);
        if (result[0].length > 0) {
            const update_query = `UPDATE users_online SET session_time=? WHERE session_id=?;`;
            await connection.query(update_query, [new Date().getTime(), session_id]);
        } else {
            const insert_query = `INSERT INTO users_online (session_id,session_time) VALUES (?,?);`;
            await connection.query(insert_query, [session_id, new Date().getTime()]);
        }
        return true;
    } catch (err) {
        throw err;
    }
};
export const editUserImage = async (user_id, img_src, mimetype, size) => {
    try {
        const query = `INSERT INTO user_image (user_id,img_src,mimetype,size) VALUES (?,?,?,?);`;
        const result = await connection.query(query, [user_id, img_src, mimetype, size]);
        return { status: 200, responseText: 'Image Uploaded Successfully', img_src: img_src };
    } catch (err) {
        throw err;
    }
};
export const getUserById = async (user_id) => {
    try {
        const query = `SELECT username,email,full_name FROM user WHERE user_id=?;`;
        const result = await connection.query(query, [user_id]);
        return result[0][0];
    } catch (err) {
        throw err;
    }
};
export const getUserAddress = async (user_id) => {
    try {
        const query = `SELECT country,city,postal_code,neighborhood,street,full_address FROM address WHERE user_id=? LIMIT 1;`;
        const result = await connection.query(query, [user_id]);
        return result[0][0] ? result[0][0] : {};
    } catch (err) {
        throw err;
    }
};
export const getUserPhone = async (user_id) => {
    try {
        const query = `SELECT phone FROM phone WHERE user_id=? AND phone!='' ORDER BY phone DESC LIMIT 1;`;
        const result = await connection.query(query, [user_id]);
        return result[0][0] ? result[0][0] : {};
    } catch (err) {
        throw err;
    }
};
export const getUserImage = async (user_id) => {
    try {
        const query = `SELECT img_src FROM user_image WHERE user_id=? ORDER BY insert_date DESC LIMIT 1;`;
        const result = await connection.query(query, [user_id]);
        return result[0][0] ? result[0][0] : {};
    } catch (err) {
        throw err;
    }
};
export const deleteUserAddress = async (user_id) => {
    try {
        const query = `DELETE FROM address WHERE user_id=?;`;
        await connection.query(query, [user_id]);
        return { status: 200, responseText: "Address Deleted Successfully." };
    } catch (err) {
        throw err;
    }
};
export const addUserAdress = async (body, user_id) => {
    try {
        let values = [
            user_id,
            !body.country ? 'Unknown' : body.country,
            !body.city ? 'Unknown' : body.city,
            !body.postal_code ? 'Unknown' : body.postal_code,
            !body.neighborhood ? 'Unknown' : body.neighborhood,
            !body.street ? 'Unknown' : body.street,
            !body.full_address ? 'Unknown' : body.full_address
        ];
        let query = `INSERT INTO address (user_id,country,city,postal_code,neighborhood,street,full_address) `;
        query += `VALUES (?,?,?,?,?,?,?);`;
        await connection.query(query, values);
        return { status: 200, responseText: "Address Inserted Successfully" };
    } catch (err) {
        throw err;
    }
};
export const updateUserAddress = async (reqBody, user_id) => {
    try {
        let body = JSON.stringify(reqBody);
        body = JSON.parse(body);
        if (Object.keys(body).length > 0) {
            let values = [];
            let query = `UPDATE address SET `;
            for (const key in body) {
                query += `${key}=?,`;
                values.push(body[key]);
            }
            query = query.replace(/,([^,]*)$/, '$1');
            query += ` WHERE user_id=?;`;
            values.push(user_id);
            await connection.query(query, values);
            return { status: 200, responseText: "Address Updated Successfully" };
        }
    } catch (err) {
        throw err;
    }
};
export const deleteHistory = async (user_id, search_title) => {
    try {
        let query = `UPDATE search_history SET search_status='deleted' WHERE user_id=? AND search_title=? `;
        query += `AND search_time=(SELECT MAX(search_time) FROM search_history s WHERE s.user_id=? AND s.search_title=?);`
        const result = await connection.query(query, [user_id, search_title, user_id, search_title]);
        if (result[0].affectedRows > 0) {
            return { status: 200, message: "success" };
        } else {
            return ({ status: 404, message: "History Doesn't Exist." });
        }
    } catch (err) {
        throw err;
    }
};
export const lastseen = async (user_id) => {
    try {
        let query = `SELECT SUBSTR(us.session_time,1,10) AS 'Last Login Date',SUBSTR(us.session_time,12) AS 'Last Login Time',`;
        query += `IF(uo.session_time>(UNIX_TIMESTAMP(NOW())*1000)-${TIME_OUT},"Online","Offline") AS 'Status',`;
        query += `uo.session_time AS 'Last Update' FROM user_session us `;
        query += `INNER JOIN users_online uo ON uo.session_id=us.session_id `;
        query += `WHERE us.user_id=? ORDER BY uo.session_time DESC LIMIT 1;`;
        const result = await connection.query(query, [user_id]);
        let lastseen_time = result[0][0]['Last Update'];
        let diff = new Date().getTime() - lastseen_time;
        let day = 24 * 60 * 60 * 1000;
        let last_active = '';
        if (diff > (day * 356)) {//more than a year
            last_active += `${Math.floor(diff / (day * 365))} Years`;
            diff /= (day * 365);
        } else if (diff > (day * 30) && diff < (day * 365)) {//more than a month less than a year
            last_active += `${Math.floor(diff / (day * 30))} Months`;
            diff /= (day * 30);
        } else if (diff > (day * 7) && diff < (day * 30)) {//more than a week less than a month
            last_active += `${Math.floor(diff / (day * 7))} Week`;
            diff /= (day * 7);
        } else if (diff > day && diff < (day * 7)) {//more than a day less than a week
            last_active += `${Math.floor(diff / (day))} Day`;
            diff /= day;
        } else if (diff < 60000) {
            last_active = 'Now';
        } else {//less than a day
            if (Math.ceil(diff / (60 * 1000)) > 60) {
                last_active += `${Math.floor(diff / (60 * 1000 * 60))} Hours`;
                diff /= (60 * 1000 * 60);
            }
            if (Math.ceil(diff / (60 * 1000)) > 1) {
                last_active += `${Math.ceil(diff / (60 * 1000))} Mintues`;
            }
        }
        delete result[0][0]['Last Update'];
        result[0][0]['Last Seen'] = last_active;
        return result[0][0];
    } catch (err) {
        throw err;
    }
};
export const usersOnline = async () => {
    try {
        let query = `SELECT u.username,u.full_name,u.email FROM user u `;
        query += `INNER JOIN user_session us ON us.user_id=u.user_id `;
        query += `INNER JOIN users_online uo ON uo.session_id=us.session_id `;
        query += `WHERE uo.session_time>(UNIX_TIMESTAMP(NOW())*1000)-${TIME_OUT} GROUP BY u.email;`;
        const result = await connection.query(query);
        const return_result = {
            Online: result[0].length,
            Users: result[0]
        };
        return return_result;
    } catch (err) {
        throw err;
    }
};
export const userHistory = async (user_id) => {
    try {
        let query = `SELECT s.user_id,s.search_title,s.search_status,s.search_time FROM search_history s `;
        query += `WHERE NOT EXISTS(`;
        query += `SELECT 1 FROM search_history sh WHERE sh.user_id=s.user_id AND sh.search_title=s.search_title `;
        query += `AND s.search_status=sh.search_status AND sh.search_time>s.search_time) `;
        query += `AND s.search_status='published' AND s.user_id=? ORDER BY s.search_time DESC LIMIT 5;`;
        const result = await connection.query(query, [user_id])
        for (let i = 0; i < result[0].length; i++) {
            delete result[0][i].user_id;
            delete result[0][i].search_status;
            result[0][i].Date = String(result[0][i].search_time).substring(0, 21);
            delete result[0][i].search_time;
        }
        return result[0];
    } catch (err) {
        throw err;
    }
};
export const addUserHistory = async (user_id, search_query) => {
    try {
        let search_history_query = `INSERT INTO search_history(user_id,search_title) VALUES (?,?);`;
        const result = await connection.query(search_history_query, [user_id, search_query]);
        return true;
    } catch (err) {
        throw err;
    }
};
export const changePassword = async (user_id, old_password, new_password) => {
    try {
        const password_select_query = `SELECT password FROM user WHERE user_id=?;`;
        const password_result = await connection.query(password_select_query, [user_id]);
        const old_password_check = await bcryptjs.compare(old_password, password_result[0][0].password);
        if (old_password_check) {
            const dup_password_query = `SELECT user_id FROM old_password WHERE user_id=? AND password=?;`;
            const dup_password = await connection.query(dup_password_query, [user_id, new_password]);
            if (dup_password[0].length > 0) {
                return { status: 202, responseText: `You Cannot Choose Any Of Your Old Passwords Again.` };
            } else {
                const salt = await bcryptjs.genSalt(10);
                const hashed_new_password = await bcryptjs.hash(new_password, salt);
                const update_query = `UPDATE user SET password=? WHERE user_id=?;`;
                const insert_old_one = 'INSERT INTO old_password (user_id,password) VALUES (?,?);';
                await connection.query(update_query, [hashed_new_password, user_id]);
                await connection.query(insert_old_one, [user_id, old_password]);
                return { status: 200, responseText: `success` };
            }
        } else {
            return { status: 201, responseText: `This Password Doesn't Match Your Old One.` };
        }
    } catch (err) {
        throw err;
    }
};
export const updateUserProfile = async (user_id, body) => {
    try {
        let values = [];
        let query = ``;
        if (body.username || body.full_name || body.email) {
            query += `UPDATE user SET `;
            if (body.username) {
                query += `username=?,`;
                values.push(body.username);
            }
            if (body.full_name) {
                query += `full_name=?,`;
                values.push(body.full_name);
            }
            if (body.email) {
                let email_check = await connection.query('SELECT user_id FROM user WHERE email=?', [body.email]);
                if (email_check[0].length > 0) {
                    return { status: 400, responseText: 'This Email Is Used By Another User.' };
                } else {
                    query += `email=?,`;
                    values.push(body.email);
                }
            }
            if (body.birth_date) {
                query += `birth_date,`;
                values.push(body.birth_date);
            }
            query = query.replace(/,([^,]*)$/, '$1');
            query += ` WHERE user_id=?;`;
            values.push(user_id);
        }
        if (body.phone == '') {
            query += `DELETE FROM phone WHERE user_id=? ORDER BY phone DESC LIMIT 1;`;
            values.push(user_id);
        } else if (body.address == '') {
            query += `DELETE FROM address WHERE user_id=?`;
            values.push(user_id);
        } else {
            if (body.phone) {
                if (body.phone_new) {
                    query += `INSERT INTO phone(phone,user_id) VALUES (?,?);`;
                } else {
                    query += `UPDATE phone SET phone=? WHERE user_id=?;`;
                }
                values.push(body.phone);
                values.push(user_id);
            }
            if (body.address) {
                if (body.address_new) {
                    query += `INSERT INTO address (full_address,user_id) VALUES (?,?);`;
                } else {
                    query += `UPDATE address SET full_address=? WHERE user_id=?;`;
                }
                values.push(body.address);
                values.push(user_id);
            }
        }
        const result = await connection.query(query, values);
        return { status: 200, responseText: 'Profile Updated Successfully' };
    } catch (err) {
        throw err;
    }
};
export const likedProd = async (user_id, prod_id) => {
    try {
        const likedQuery = `SELECT user_id FROM likes WHERE user_id=? AND product_id=?`;
        const liked = await connection.query(likedQuery, [user_id, prod_id]);
        return liked[0][0];
    } catch (err) {
        throw err;
    }
};
export const viewProd = async (user_id, prod_id) => {

    try {
        const sevenDaysAgo = (new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString().substring(0, 10);
        const view_exist_query = `SELECT user_id,product_id,view_date FROM product_view WHERE user_id=? AND product_id=? AND view_date>?`;
        const result = await connection.query(view_exist_query, [user_id, prod_id, sevenDaysAgo]);
        if (result[0] == 0) {
            await connection.query(`INSERT INTO product_view (user_id,product_id) VALUES (?,?);`, [user_id, prod_id]);
        }
        return true;
    }
    catch (err) {
        throw err;
    }
};
export const likeProd = async (user_id, prod_id) => {

    try {
        let query = `INSERT INTO likes(user_id,product_id) VALUES (?,?);`;
        const result = await connection.query(query, [user_id, prod_id]);
        return true;
    } catch (err) {
        throw err;
    }
};
export const unlikeProd = async (user_id, prod_id) => {

    try {
        const query = `DELETE FROM likes WHERE user_id=? AND product_id=?;`;
        const result = await connection.query(query, [user_id, prod_id]);
        return true;
    } catch (err) {
        throw err;
    }
};
export const findOrCreate = async (profile) => {
    try {
        const search_query = `SELECT user_id FROM provider WHERE provider_id=?;`;
        const search_result = await connection.query(search_query, profile.id);
        if (search_result[0].length == 0) {
            const insert_query = `INSERT INTO user(username,full_name,email,password,birth_date) VALUES (?,?,?,?,?);`;
            const hashedPassword = await bcryptjs.hash(profile.id, 10);
            await connection.query(insert_query, [profile._json.name, profile._json.name, profile._json.email, hashedPassword, new Date().toISOString().substring(0, 10)]);
            const id_result = await connection.query(`SELECT user_id FROM user WHERE email=?`, [profile._json.email]);
            let user_id = id_result[0][0].user_id;
            await connection.query(`INSERT INTO provider (provider,provider_id,user_id) VALUES (?,?,?);`, [profile.provider, profile.id, user_id]);
            profile.user_id = user_id;
            profile.username = profile._json.name;
        } else {
            const id_result = await connection.query(`SELECT user_id FROM provider WHERE provider_id=?;`, [profile.id]);
            let user_id = id_result[0][0].user_id;
            const username_result = await connection.query(`SELECT username FROM user WHERE user_id=?;`, [user_id]);
            profile.user_id = user_id;
            profile.username = username_result[0][0].username;
        }
        return profile;
    } catch (err) {
        return ("This Email Is Used By Another User.");
    }
};