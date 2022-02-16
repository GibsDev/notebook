import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '../Authentication';

export default function LoginRegister() {

    const { user, login, register, walletLogin } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [existingUser, setExistingUser] = useState(false);

    const navigate = useNavigate();
    const controller = new AbortController();
    const { signal } = controller;

    useEffect(() => {
        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
        return () => {
            setUsername('');
            setPassword('');
        };
    }, [user]);

    async function onUsernameLostFocus() {
        const res = await fetch('/auth/username/' + username, { signal });
        if (res.ok) {
            setExistingUser(true);
        } else {
            setExistingUser(false);
        }
    }

    function onUsernameChanged(e) {
        setUsername(e.target.value);
        setExistingUser(false);
    }

    function onPasswordChanged(e) {
        setPassword(e.target.value);
    }

    async function onWalletConnectClicked() {
        try {
            await walletLogin();
            navigate('/');
        } catch (e) {
            toast.error(e.message);
        }
    }

    async function onLoginClicked() {
        try {
            const loginPromise = login(username, password);
            toast.promise(loginPromise, {
                pending: 'Logging in...',
                success: 'Successfully logged in',
                error: 'Unable to login'
            });
            await loginPromise;
            navigate('/');
        } catch (e) {
            toast.error(e.message);
        }
    }

    async function onRegisterClicked() {
        try {
            const successMessage = await register(username, password);
            toast(successMessage);
            setExistingUser(true);
        } catch (e) {
            toast.error(e.message);
        }
    }

    return <>
        <div className="d-flex flex-column gap-2 my-3">
            <div className="d-flex flex-column gap-2">
                <h2>Login or Register</h2>

                <div className="input-group">
                    <span className="input-group-text" id="username">Username</span>
                    <input className="form-control"
                        type="text"
                        value={username}
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="username"
                        onChange={onUsernameChanged}
                        onBlur={onUsernameLostFocus} />
                </div>

                <div className="input-group">
                    <span className="input-group-text" id="password">Password</span>
                    <input className="form-control"
                        type="password"
                        value={password}
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="password"
                        onChange={onPasswordChanged} />
                </div>
            </div>

            <div className="d-flex gap-2">
                <button className="btn btn-secondary flex-grow-1"
                    disabled={!username || !password}
                    onClick={existingUser ? onLoginClicked : onRegisterClicked}>
                    {existingUser ? 'Login' : 'Register'}
                </button>

                <button className="btn btn-secondary flex-grow-1"
                    onClick={onWalletConnectClicked}>Connect wallet</button>
            </div>
        </div>
    </>;
}
