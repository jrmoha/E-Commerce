import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import GitHubStrategy from 'passport-github2';
import { providerFindOrCreateController } from './controller/userAuthController.js';


passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALL_BACK_URL,
    scope: ['email', 'profile'],
    state: true
}, providerFindOrCreateController));
passport.use(new GitHubStrategy.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALL_BACK_URL,
    scope: ['email', 'profile'],
    state: true
}, providerFindOrCreateController));
passport.serializeUser(function (user, done) { done(null, user); });
passport.deserializeUser(function (user, done) { done(null, user); });

export default passport;