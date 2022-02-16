import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './style/style.css';

import PrivateRoute from './PrivateRoute';
import CustomToastContainer from './components/ToastContainer';
import UserDropdown from './modules/UserDropdown';
import Authentication from './Authentication';
import LoginRegister from './routes/LoginRegister';
import Settings from './routes/Settings';
import Notebook from './routes/Notebook';

export default function App() {

    return <>
        <CustomToastContainer />

        <Authentication>
            <Router>
                <nav className="navbar navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand" to="/">Notebook</Link>

                        <UserDropdown />
                    </div>
                </nav>

                <div className="container">
                    <Routes>
                        <Route path="/login" element={
                            <LoginRegister />
                        } />

                        <Route path="/settings" element={
                            <PrivateRoute>
                                <Settings />
                            </PrivateRoute>
                        } />

                        <Route path="*" element={
                            <PrivateRoute>
                                <Notebook />
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </Router >
        </Authentication >
    </>;
}
