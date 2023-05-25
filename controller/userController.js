import { editUserImage, getUserById, getUserAddress, getUserPhone, getUserImage, deleteUserAddress, addUserAdress, updateUserAddress, deleteHistory, lastseen, usersOnline, userHistory, changePassword, updateUserProfile } from "../models/userModel.js";
import upload from "../multer.js";
export const multerController = async (req, res, next) => {
    upload.single('image');
};
export const editImageController = async (req, res, next) => {
    console.log(req.file);
    const user_id = req.session.user_id;
    if (user_id) {
        try {
            const result = await editUserImage(user_id, req.file.filename, req.file.mimetype, req.file.size);
            console.log(result);
            res.status(201).send(result);
        } catch (err) {
            res.status(401).send(err);
        }
    } else {
        res.status(404).redirect('/404');
    }
};
export const getProfileController = async (req, res) => {
    const user_id = req.session.user_id;
    if (user_id) {
        try {
            const result = await Promise.all([getUserById(user_id), getUserAddress(user_id), getUserPhone(user_id), getUserImage(user_id)]);
            const basic_result = result[0];
            const address_result = result[1];
            const phone_result = result[2];
            const img_result = result[3];
            const options = {
                username: basic_result.username,
                email: basic_result.email,
                full_name: basic_result.full_name,
                address: Object.keys(address_result).length == 0 ? undefined : address_result.full_address,
                phone: Object.keys(phone_result).length == 0 ? undefined : phone_result.phone,
                image: Object.keys(img_result).length == 0 ? undefined : img_result.img_src
            };
            res.render('profile', options);
        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        return res.redirect('/login');
    }
};
export const getAddressController = async (req, res) => {
    if (req.session.user_id) {
        const address_result = await getUserAddress(req.session.user_id);
        const img_result = await getUserImage(req.session.user_id);
        let options;
        if (Object.keys(address_result).length > 0) {
            options = {
                username: req.session.username,
                image: img_result.img_src,
                has_address: true,
                country: address_result.country,
                city: address_result.city,
                postal_code: address_result.postal_code,
                neighborhood: address_result.neighborhood,
                street: address_result.street,
                full_address: address_result.full_address,
            };
        } else {
            options = {
                username: req.session.username,
                image: img_result.img_src,
                has_address: false,
            };
        }
        res.render('address', options);
    } else {
        return res.redirect('/login');
    }
};
export const deleteAddressController = async (req, res) => {
    const user_id = req.session.user_id;
    if (user_id) {
        try {
            const result = await deleteUserAddress(user_id);
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(404).json('Not Auth');
    }
};
export const editAddressController = async (req, res) => {
    const user_id = req.session.user_id;
    if (user_id) {
        try {
            const address_result = await getUserAddress(user_id);
            if (Object.keys(address_result).length == 0) {
                const result = await addUserAdress(req.body, user_id);
                res.status(200).send(result);
            } else {
                const result = await updateUserAddress(req.body, user_id);
                res.status(200).send(result);
            }
        } catch (err) {
            return res.status(400).send("Error Occurred" + err);
        }
    } else {
        res.status(404).json('Not Auth');
    }
};
export const addAddressController = async (req, res) => {
    const user_id = req.session.user_id;
    if (user_id) {
        try {
            const result = await addUserAdress(req.body, user_id);
            res.status(200).send(result);
        } catch (err) {
            return res.status(400).send("Error Occurred At" + err);
        }
    } else {
        res.status(404).send('error');
    }
};
export const updateProfileController = async (req, res) => {
    const user_id = req.session.user_id;
    if (user_id) {
        const result = await updateUserProfile(user_id, req.body);
        res.status(200).send(result);
    } else {
        res.status(404).send('Not Authenticated');
    }
};
export const changePasswordController = async (req, res) => {
    const user_id = req.session.user_id;
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;
    if (user_id && old_password && new_password) {
        const result = await changePassword(user_id, old_password, new_password);
        res.send(result);
    }
};
export const getHistoryController = async (req, res) => {
    const user_id = req.session.user_id;
    if (user_id) {
        const result = await userHistory(user_id);
        res.status(200).json(result);
    } else {
        res.redirect('/');
    }
};
export const deleteHistoryController = async (req, res) => {
    const user_id = req.session.user_id;
    const search_title = req.query.search_title;
    if (user_id && search_title) {
        try {
            const result = await deleteHistory(user_id, search_title);
            res.status(200).send(result);
        } catch (err) {
            return res.status(400).send('error');
        }
    } else {
        res.status(404).send('error');
    }
};
export const getUsersOnlineController = async (req, res) => {
    try {
        const result = await usersOnline();
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json(err);
    }
};
export const lastseenController = async (req, res) => {
    let user_id = req.params.user_id;
    if (user_id) {
        try {
            const lastseenResult = await lastseen(user_id);
            res.status(200).send(lastseenResult);
        } catch (err) {
            res.status(404).send(err);
        }
    }
};