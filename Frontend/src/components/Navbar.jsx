import { FiSearch, FiMenu } from 'react-icons/fi';
import { BsSun, BsMoon } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import { useState, useEffect } from 'react';

const Navbar = ({ theme, toggleTheme, toggleSidebar }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // change 'token' to your actual token key
        setIsLoggedIn(!!token);
    }, []);

    const handleClick = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            window.location.href = "/";
            setIsLoggedIn(false);
            window.location.reload();
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand p-2" style={{ backgroundColor: 'var(--twitch-dark-secondary)' }}>
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <Link to="/" className="navbar-brand me-2 me-lg-4">
                        Hell Cast
                        </Link>

                        {/* Navigation links - hidden on mobile */}
                        <div className="d-none d-md-flex">
                            <Link to="/following" className="btn fw-bold me-3" style={{ color: 'var(--twitch-text)' }}>
                                Following
                            </Link>
                            <Link to="/browse" className="btn fw-bold" style={{ color: 'var(--twitch-text)' }}>
                                Browse
                            </Link>
                            <Link to="/videosection" className="btn fw-bold" style={{ color: 'var(--twitch-text)' }}>
                                Content
                            </Link>
                        </div>

                        {/* Search bar - hidden on small screens */}
                        <div className="input-group ms-2 ms-lg-4 d-none d-sm-flex" style={{ width: '400px', maxWidth: '100%' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                style={{
                                    backgroundColor: 'var(--twitch-dark-tertiary)',
                                    borderColor: 'var(--twitch-dark-tertiary)',
                                    color: 'var(--twitch-text)'
                                }}
                            />
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: 'var(--twitch-dark-tertiary)',
                                    color: 'var(--twitch-text-secondary)'
                                }}
                            >
                                <FiSearch />
                            </button>
                        </div>
                    </div>

                    {/* Right side - Icons and user menu */}
                    <div className="d-flex align-items-center">
                        {/* Search icon for mobile - hidden on larger screens */}
                        <button className="btn d-sm-none mx-1" style={{ color: 'var(--twitch-text)' }}>
                            <FiSearch size={20} />
                        </button>

                        {/* Theme toggle - always visible */}
                        <button
                            className="btn mx-2"
                            onClick={toggleTheme}
                            style={{ color: 'var(--twitch-text)' }}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <BsSun size={20} /> : <BsMoon size={20} />}
                        </button>

                        {/* Login button */}
                        <div className="d-flex align-items-center gap-3">
                            <button
                                className="btn btn-purple mx-1 mx-lg-2 login-btn"
                                onClick={handleClick}
                                style={{
                                    backgroundColor: 'var(--btn-purple)',
                                    color: 'white',
                                    borderRadius: '12px',
                                }}
                            >
                                {isLoggedIn ? 'Logout' : 'Log In'}
                            </button>
                        </div>

                    </div>
                </div>
            </nav>
            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                theme={theme}
            />
        </>
    );
};

export default Navbar;