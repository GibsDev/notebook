const { v4: uuid } = require('uuid');
const express = require('express');
const jsonParser = express.json();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const Web3Token = require('web3-token');
const noteApp = require('./application.js');

// Cookie keys
const JWT_COOKIE = 'jwt';
const WEB3_COOKIE = 'web3';

const router = express.Router();
const secret = 'dev'; // TODO crypto.randomBytes(64).toString('hex');

/**
 * An in memory structure that holds all invalidated tokens that have not yet expired. Each authentication request checks if the token used is in this structure and thus invalid.
 * Every 10 minutes expired tokens will be pruned (removed) from this strucutre as they are no longer valid anyway.
 * Maps token id => expiration
 * Expiration time is in seconds since epoch
 */
const invalidTokens = {};

/**
 * Invalid token pruning function every 10 minutes
 */
setInterval(() => {
    const currentEpochSeconds = Math.floor(Date.now() / 1000);
    for (const id of Object.keys(invalidTokens)) {
        const expiration = invalidTokens[id];
        if (expiration < currentEpochSeconds) {
            delete invalidTokens[id];
        }
    }
}, 1000 * 60 * 10);

/**
 * Rate limiting middleware used for some authentication endpoints to help prevent brute forcing authentication. Each endpoint gets it's own rate limiter.
 * @returns A new instance of a rate limiter
 */
function limiter() {
    return rateLimit({
        windowMs: 1000 * 60 * 5, // 5 minutes
        max: 15, // Request limit per `window`
        standardHeaders: true,
        legacyHeaders: false
    });
}

/**
 * @param {String} user The id of the user
 * @returns A JWT token
 */
function createJwtToken(username) {
    const tokenId = uuid();
    const token = jwt.sign({ username, id: tokenId }, secret, { expiresIn: '1d' });
    const decoded = jwt.verify(token, secret);
    const expDate = new Date(decoded.exp * 1000);
    return [token, expDate];
}

/**
 * Attempts to log the user in and sets the jwt authentication cookie
 * @param {String} username 
 * @param {String} password 
 * @param {express.Response} res The response object of the login endpoint middleware
 */
async function login(username, password, res) {
    try {
        await noteApp(null).verifyLogin(username, password);
        const [token, expiration] = createJwtToken(username);
        res.cookie(JWT_COOKIE, token, {
            expires: expiration,
            sameSite: 'strict',
            httpOnly: true
        });
        return res.sendStatus(200);
    } catch (e) {
        return res.sendStatus(401);
    }
}

async function parseTokens(req) {
    cookieParser()(req, undefined, () => { });
    const jwt_token = req.cookies[JWT_COOKIE];
    const web3_token = req.cookies[WEB3_COOKIE];
    const auth = {};
    if (jwt_token) {
        const jwt = await jwtAuthentication(jwt_token);
        if (jwt) {
            auth.jwt = jwt;
        }
    }
    if (web3_token) {
        const web3 = await web3Authentication(web3_token);
        if (web3) {
            auth.web3 = web3;
        }
    }
    if (auth.jwt || auth.web3) {
        auth.user = auth.jwt?.user || auth.web3?.user;
        return auth;
    }
    return null;
}

/**
 * Authentication middlware that looks for valid credentials in cookies and sets req.auth accordingly
 */
async function authMiddleware(req, res, next) {
    const auth = await parseTokens(req);
    if (auth) {
        if (!auth.jwt && req.cookies[JWT_COOKIE]) {
            res.clearCookie(JWT_COOKIE);
        }
        if (!auth.web3 && req.cookies[WEB3_COOKIE]) {
            res.clearCookie(WEB3_COOKIE);
        }
        req.auth = auth;
        return next();
    } else {
        return res.sendStatus(401);
    }
}

/**
 * Tries to authenticate a client using a jwt token
 */
async function jwtAuthentication(token) {
    try {
        const decoded = jwt.verify(token, secret);
        const id = decoded.id;
        if (invalidTokens[id]) throw new Error('This token has been invalidated');
        let user = await noteApp(null).getUserFromUsername(decoded.username);
        if (user === null) {
            return null;
        }
        return {
            user: user.id,
            tokenId: decoded.id,
            expiration: decoded.exp, // Epoch seconds
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * Tries to authenticate a client using a web3 token
 */
async function web3Authentication(token) {
    try {
        const { address, body } = await Web3Token.verify(token);
        const id = body['request-id'];
        if (invalidTokens[id]) throw new Error('This token has been invalidated');
        let user = await noteApp(null).getUserFromAddress(address);
        // Create a user for this wallet if necessary
        if (!user) {
            const newUser = await noteApp(null).createUser();
            user = await noteApp(newUser.id).linkWallet(address);
        }
        const expDate = new Date(body['expiration-time']);
        const expInSeconds = Math.floor(expDate.valueOf() / 1000);
        return {
            user: user.id,
            tokenId: id,
            expiration: expInSeconds
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * Invalidate all authentication tokens
 */
router.post('/logout', authMiddleware, (req, res) => {
    if (req.auth) {
        if (req.auth.jwt) {
            invalidTokens[req.auth.jwt.tokenId] = req.auth.jwt.expiration;
            res.clearCookie(JWT_COOKIE);
        }
        if (req.auth.web3) {
            invalidTokens[req.auth.web3.tokenId] = req.auth.web3.expiration;
            res.clearCookie(WEB3_COOKIE);
        }
    }
    return res.sendStatus(200);
});

/**
 * Login with JWT authentication
 */
router.post('/login', limiter(), jsonParser, async (req, res) => {
    if (!req.body) return res.status(400).send('Unable to parse json request body');
    const { username, password } = req.body;
    if (!username) return res.status(400).send('username not provided');
    if (!password) return res.status(400).send('passsword not provided');
    return await login(username, password, res);
});

/**
 * Register a new account for JWT authentication
 */
router.post('/register', limiter(), jsonParser, async (req, res) => {
    if (!req.body) return res.status(400).send('Unable to parse json request body');
    const { username, password } = req.body;
    if (!username) return res.status(400).send('username not provided');
    if (!password) return res.status(400).send('passsword not provided');
    await noteApp(null).registerLogin(username, password);
    const user = await noteApp(null).createUser();
    await noteApp(null).linkLogin(username, user.id);
    return res.status(200).send(JSON.stringify({ username }));
});

/**
 * Check if a username exists
 */
router.get('/username/:username', limiter(), async (req, res) => {
    if (await noteApp(null).hasLogin(req.params.username)) {
        return res.sendStatus(200);
    } else {
        return res.sendStatus(404);
    }
});

/**
 * Link a wallet
 */
router.post('/link', limiter(), authMiddleware, jsonParser, async (req, res) => {
    if (!req.auth.jwt) {
        return res.status(400).send('You must be logged in using a username and password to link a wallet');
    }
    try {
        const { address, body } = await Web3Token.verify(req.body.token);
        const id = body['request-id'];
        if (invalidTokens[id]) throw new Error('This token has been invalidated');
        await noteApp(req.auth.user).linkWallet(address);
        return res.status(200).send('Wallet linked to current user');
    } catch (e) {
        return res.status(400).send(e.message);
    }
});

module.exports = {
    authRouter: router,
    authenticate: authMiddleware
};