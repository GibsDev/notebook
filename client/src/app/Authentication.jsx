import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';

import { useApolloClient, gql } from '@apollo/client';

const GET_USER = gql(`
query {
    getUser {
        id
        nickname
        collapseNotes
        username
        address
    }
}`);

const SET_NICKNAME = gql(`
mutation ($nickname: String = null) {
    setNickname(nickname: $nickname)
}`);

const SET_COLLAPSE_NOTES = gql(`
mutation ($collapse: Boolean) {
    setCollapseNotes(collapse: $collapse)
}`);

export const AuthContext = createContext();

Authentication.propTypes = {
    children: PropTypes.element
};

export default function Authentication({ children }) {

    const client = useApolloClient();

    const controller = new AbortController();
    const { signal } = controller;

    const [{ id, nickname, collapseNotes, username, address }, setAuthState] = useState({
        id: undefined,
        nickname: undefined,
        collapseNotes: null,
        username: null,
        address: null
    });

    async function syncUser() {
        try {
            const query = await client.query({
                query: GET_USER
            });
            const user = query.data.getUser;
            setAuthState(user);
        } catch (e) {
            setAuthState({
                id: null,
                nickname: null,
                collapseNotes: null,
                username: null,
                address: null
            });
        }
    }

    useEffect(() => {
        syncUser();
        return () => { };
    }, []);


    async function logout() {
        await fetch('/auth/logout', {
            method: 'post'
        });
        syncUser();
    }

    /* eslint-disable no-undef */
    async function web3Token(expirationString) {
        const web3TokenLib = import('web3-token');
        toast.promise(web3TokenLib, {
            pending: 'Loading web3-token bundle...',
            error: 'Failed to load web3-token bundle'
        });
        const { default: Web3Token } = await web3TokenLib;
        if (!ethereum) {
            throw new Error('MetaMask not found');
        }
        await ethereum.request({ method: 'eth_requestAccounts' });
        const mm_sign = (msg) => {
            return ethereum.request({
                method: 'personal_sign',
                params: [ethereum.selectedAddress, msg]
            });
        };
        const token = Web3Token.sign(mm_sign, {
            expires_in: expirationString,
            request_id: uuid()
        });
        return token;
    }
    /* eslint-enable no-undef */

    async function walletLogin() {
        const token = await web3Token('2m');
        const login = fetch('/auth/login', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                web3_token: token
            }),
            signal
        });
        toast.promise(login, {
            pending: 'Logging in...',
            error: 'Error logging in'
        });
        if ((await login).ok) {
            syncUser();
        }
    }

    async function register(username, password) {
        const res = await fetch('/auth/register', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            }),
            signal
        });
        if (res.ok) {
            return `Login '${username}' created`;
        } else {
            if (res.status === 429) {
                throw new Error('Too many requests, try again in 5 minutes');
            } else {
                throw new Error(JSON.stringify(res));
            }
        }
    }

    async function login(username, password) {
        // Make sure to logout current user
        if (id) await logout();
        // Login with username and password and set user accordingly
        const res = await fetch('/auth/login', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            }),
            signal
        });
        if (res.ok) {
            syncUser();
        } else {
            if (res.status === 429) {
                throw new Error('Too many attempts, try again later');
            }
            throw new Error('Invalid login');
        }
    }

    async function changeNickname(nick) {
        if (nick === nickname) return;
        await client.mutate({
            mutation: SET_NICKNAME,
            variables: {
                nickname: nick
            }
        });
        syncUser();
    }

    async function setCollapsedByDefault(collapse) {
        await client.mutate({
            mutation: SET_COLLAPSE_NOTES,
            variables: {
                collapse
            }
        });
        syncUser();
    }

    return <AuthContext.Provider value={{ user: id, nickname, username, address, collapseNotes, setCollapsedByDefault, changeNickname, login, register,  walletLogin, web3Token, logout }}>
        {children}
    </AuthContext.Provider>;
}
