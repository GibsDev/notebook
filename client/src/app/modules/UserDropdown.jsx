import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../Authentication';
import LogoutButton from '../modules/LogoutButton';

export default function UserDropDown() {

    const { user, nickname, username, address } = useContext(AuthContext);

    const trimmedAddress = address ? address.substring(0, 6) : null;
    const displayName = nickname || username || trimmedAddress || 'User';

    if (!user) return null;

    return (
        <div className="dropdown">
            <button className="btn btn-dark dropdown-toggle px-0"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                {displayName}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end"
                aria-labelledby="userDropdown">
                <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li className="px-3"><LogoutButton /></li>
            </ul>
        </div>
    );
}