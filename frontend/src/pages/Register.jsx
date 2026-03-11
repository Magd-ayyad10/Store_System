import { useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthScene from '../components/three/AuthScene';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        full_name: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.email || !form.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await registerUser(form);
            const loginData = await loginUser(form.username, form.password);
            login(loginData.access_token);
            toast.success('Account created! Welcome! 🚀');
            navigate('/products');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'username', label: 'Your name', type: 'text', required: true, placeholder: 'First and last name' },
        { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
        { name: 'full_name', label: 'Full name (optional)', type: 'text', required: false, placeholder: 'Your full name' },
        { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'At least 6 characters' },
    ];

    return (
        <div className="auth-page">
            <div className="auth-canvas-wrapper">
                <Suspense fallback={null}>
                    <AuthScene />
                </Suspense>
            </div>

            <Link to="/" style={{ position: 'relative', zIndex: 10, marginBottom: 20, fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Store<span style={{ color: '#ff9900' }}>X</span>
            </Link>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2>Create account</h2>

                <form onSubmit={handleSubmit}>
                    {fields.map((field, i) => (
                        <motion.div
                            key={field.name}
                            className="form-group"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 + i * 0.08 }}
                        >
                            <label htmlFor={`register-${field.name}`}>
                                {field.label}
                            </label>
                            <input
                                id={`register-${field.name}`}
                                className="form-input"
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={form[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                autoComplete={field.name === 'password' ? 'new-password' : field.name}
                            />
                        </motion.div>
                    ))}

                    <motion.button
                        type="submit"
                        className="btn-amazon btn-amazon-buy"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.01 }}
                        whileTap={{ scale: loading ? 1 : 0.99 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {loading ? (
                            <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        ) : (
                            'Create your StoreX account'
                        )}
                    </motion.button>
                </form>

                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)', marginTop: 14, lineHeight: 1.5 }}>
                    By creating an account, you agree to StoreX&apos;s Conditions of Use and Privacy Notice.
                </p>

                <div className="auth-divider">Already have an account?</div>

                <Link to="/login">
                    <motion.button
                        className="btn-amazon btn-amazon-secondary"
                        style={{ width: '100%', padding: 10 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        Sign in
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
