import { findUser, insertSession, insertUser, checkPassword, updateSession, findOrCreate } from "../models/userModel.js";
export const getRegPage = (req, res) => {
    !req.session.user_id ? res.render('registration') : res.redirect('/');
};
export const regController = async (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const reg_email = req.body.reg_email;
    const password = req.body.reg_password;
    const full_date = `${req.body.year}-${req.body.month}-${req.body.day}`;
    const full_name = `${first_name} ${last_name}`;
    const result = await findUser(reg_email);
    if (result.length > 0) {
        const saved = {
            email_err: true,
            first_name: first_name,
            last_name: last_name,
            email: reg_email,
        };
        res.status(201).render('registration', saved);
    } else {
        try {
            const insert_result = await insertUser(first_name, full_name, reg_email, password, full_date);
            const { user_id, username } = insert_result[0][1][0];
            await insertSession(req.session.id, user_id, req.socket.remoteAddress);
            req.session.user_id = user_id;
            req.session.username = username;
            res.status(200).redirect('/');
        } catch (err) {
            res.status(401).send(err);
        }
    }
};
export const getLoginPage = (req, res) => {
    !req.session.user_id ? res.render('login', { error: req.session.error }) : res.redirect('/');
};
export const loginController = async (req, res) => {
    const email = req.body.email_address;
    const password = req.body.password;
    try {
        const search_result = await findUser(email);
        if (search_result.length > 0) {
            const checked = await checkPassword(password, search_result[0].password);
            if (checked) {
                req.session.user_id = search_result[0].user_id;
                req.session.username = search_result[0].username;
                await insertSession(req.session.id, search_result[0].user_id, req.socket.remoteAddress);
                res.status(200).redirect('/');
            } else {
                res.status(404).render('login', { password_err: true, email: req.body.email_address });
            }
        } else {
            res.status(404).render('login', { email_err: true, email: req.body.email_address });
        }
    } catch (err) {
        res.status(400).send(err);
    }
};
export const logoutController = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};
export const isAuthController = (req, res) => {
    if (req.session.user_id) {
        console.log('yeah');
        res.send([true, req.sessionID]);
    } else {
        res.send([false, null]);
    }
};
export const updateSessionController = async (req, res) => {
    const session_id = req.query.session_id;
    try {
        const result = await updateSession(session_id);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
};
export const providerFindOrCreateController = async function verify(_accessToken, _refreshToken, profile, cb) {
    try {
        const profile_result = await findOrCreate(profile);
        return cb(null, profile_result);
    } catch (err) {
        return cb(null, err);
    }
};
export const providerLoginController = async function (req, res) {
    if (req.user.user_id) {
        req.session.user_id = req.user.user_id;
        req.session.username = req.user.username;
        await insertSession(req.session.id, req.user.user_id, req.socket.remoteAddress);
        res.redirect('/');
    } else {
        req.session.error = req.user;
        res.redirect('/login');
    }
};