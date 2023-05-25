import { Router } from "express";
import {
    addAddressController,
    changePasswordController,
    deleteAddressController,
    deleteHistoryController,
    editAddressController,
    editImageController,
    getAddressController,
    getHistoryController,
    getProfileController,
    getUsersOnlineController,
    lastseenController,
    updateProfileController,
} from "../controller/userController.js";
import upload from "../multer.js";

const router = Router();

router.post('/users/profile/edit/image', upload.single('image'), editImageController);
router.get('/users/profile', getProfileController);
router.get('/users/address', getAddressController);
router.delete('/users/address/delete', deleteAddressController);
router.put('/users/address/edit', editAddressController);
router.post('/users/address/add', addAddressController);
router.put('/users/update', updateProfileController);
router.put('/users/change-password', changePasswordController);
router.get('/users/history', getHistoryController);
router.put('/users/history/delete', deleteHistoryController);
router.get('/users/online', getUsersOnlineController);
router.get('/users/lastseen/:user_id', lastseenController);
export default router;