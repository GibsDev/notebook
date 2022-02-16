import { useContext } from 'react';

import { AuthContext } from '../Authentication';

export default function LogoutButton() {

    const { logout } = useContext(AuthContext);

    return <button className="btn btn-outline-danger w-100" onClick={logout}>Logout</button>;
}