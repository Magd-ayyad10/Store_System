import { useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AuthScene from '../components/three/AuthScene';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(username, password);
            login(data.access_token);
            toast.success('Welcome back! 🎉');
            navigate('/products');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-canvas-wrapper">
                <Suspense fallback={null}>
                    <AuthScene />
                </Suspense>
            </div>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2>Sign in</h2>

                <form onSubmit={handleSubmit}>
                    <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <label htmlFor="login-username">Username</label>
                        <input
                            id="login-username"
                            className="form-input"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </motion.div>

                    <motion.div className="form-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            className="form-input"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="btn-amazon btn-amazon-buy"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.01 }}
                        whileTap={{ scale: loading ? 1 : 0.99 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {loading ? (
                            <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        ) : (
                            'Sign in'
                        )}
                    </motion.button>
                </form>

                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)', marginTop: 14, lineHeight: 1.5 }}>
                    By signing in, you agree to StoreX&apos;s Conditions of Use and Privacy Notice.
                </p>

                <div className="auth-divider">New to StoreX?</div>

                <Link to="/register">
                    <motion.button
                        className="btn-amazon btn-amazon-secondary"
                        style={{ width: '100%', padding: 10 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        Create your StoreX account
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
