import { Router } from "express";
import {
    getLoginPage,
    getRegPage,
    isAuthController,
    loginController,
    logoutController,
    regController,
    updateSessionController,
    providerLoginController
} from "../controller/userAuthController.js";
import passport from '../passport.js';

const router = Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get(`/auth/google/dash`, passport.authenticate('google', { failureRedirect: '/login' }), providerLoginController);
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/dash', passport.authenticate('github', { failureRedirect: '/login' }), providerLoginController);
router.get('/registration', getRegPage);
router.post('/registration', regController);
router.get('/login', getLoginPage);
router.post('/login', loginController);
router.get('/logout', logoutController);
router.get('/isAuth', isAuthController);
router.post('/users/update/session', updateSessionController);

export default router;