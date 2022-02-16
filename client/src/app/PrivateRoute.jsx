import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Authentication';

export default function PrivateRoute({ children }) {
    
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    function redirect() {
        if (user === null) {
            navigate('/login');
        }
    }

    useEffect(() => {
        redirect();
    }, []);

    useEffect(() => {
        redirect();
    }, [user]);

    return children;
}