import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiShoppingCart, FiSun, FiMoon, FiMapPin,
    FiUser, FiLogOut, FiGrid, FiChevronDown, FiMenu,
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getCartCount } from '../services/api';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            getCartCount(user.id).then(data => setCartCount(data.count)).catch(() => { });
        } else {
            setCartCount(0);
        }
    }, [isAuthenticated, user, location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/products${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Main Navbar */}
            <motion.header
                className="navbar-main"
                initial={{ y: -60 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            >
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span>Store</span>
                    <span style={{ color: '#ff9900' }}>X</span>
                </Link>

                {/* Deliver to */}
                <div className="nav-action-item" style={{ display: 'none' }}>
                    <span className="nav-action-label">Deliver to</span>
                    <span className="nav-action-value">
                        <FiMapPin style={{ fontSize: '1rem', marginRight: 2 }} /> Location
                    </span>
                </div>

                {/* Search Bar */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <select aria-label="Search category">
                        <option>All</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search StoreX"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search products"
                    />
                    <button type="submit" className="navbar-search-btn" aria-label="Search">
                        <FiSearch />
                    </button>
                </form>

                {/* Actions */}
                <div className="navbar-actions">
                    {/* Theme toggle */}
                    <motion.button
                        className="nav-action-item"
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle theme"
                    >
                        <span className="nav-action-label">Theme</span>
                        <span className="nav-action-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AnimatePresence mode="wait">
                                {theme === 'light' ? (
                                    <motion.span key="moon" initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }} transition={{ duration: 0.15 }}>
                                        <FiMoon />
                                    </motion.span>
                                ) : (
                                    <motion.span key="sun" initial={{ opacity: 0, rotate: 30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -30 }} transition={{ duration: 0.15 }}>
                                        <FiSun />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {theme === 'light' ? 'Dark' : 'Light'}
                        </span>
                    </motion.button>

                    {/* Account */}
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-action-item">
                                <span className="nav-action-label">Hello, {user?.username}</span>
                                <span className="nav-action-value">
                                    Account <FiChevronDown style={{ fontSize: '0.7rem' }} />
                                </span>
                            </Link>
                            <button className="nav-action-item" onClick={handleLogout}>
                                <span className="nav-action-label">Sign out</span>
                                <span className="nav-action-value">
                                    <FiLogOut style={{ marginRight: 3 }} /> Logout
                                </span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-action-item">
                            <span className="nav-action-label">Hello, sign in</span>
                            <span className="nav-action-value">
                                Account <FiChevronDown style={{ fontSize: '0.7rem' }} />
                            </span>
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to="/cart" className="nav-cart">
                        <span className="cart-count">{cartCount}</span>
                        <FiShoppingCart className="cart-icon" />
                        <span className="cart-label">Cart</span>
                    </Link>
                </div>
            </motion.header>

            {/* Sub Navbar */}
            <nav className="navbar-sub">
                <Link
                    to="/"
                    className={`subnav-link ${isActive('/') ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                    <FiMenu /> All
                </Link>
                <Link to="/products" className={`subnav-link ${isActive('/products') ? 'active' : ''}`}>
                    Today&apos;s Deals
                </Link>
                <Link to="/products" className="subnav-link">
                    Best Sellers
                </Link>
                <Link to="/products" className="subnav-link">
                    New Releases
                </Link>
                {isAuthenticated && (
                    <Link to="/dashboard" className={`subnav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        <FiGrid style={{ marginRight: 3, verticalAlign: 'middle' }} /> Dashboard
                    </Link>
                )}
                {!isAuthenticated && (
                    <Link to="/register" className="subnav-link" style={{ color: '#ff9900', fontWeight: 600 }}>
                        Sign Up — Free
                    </Link>
                )}
            </nav>
        </>
    );
}
