import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiPackage, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getCart, removeFromCart } from '../services/api';

export default function Cart() {
    const { user, isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        if (!user?.id) return;
        try {
            const data = await getCart(user.id);
            setCart(data);
        } catch {
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const handleRemove = async (productId) => {
        try {
            await removeFromCart(user.id, productId);
            toast.success('Removed from cart');
            fetchCart();
        } catch {
            toast.error('Failed to remove item');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <FiShoppingCart size={64} style={{ color: 'var(--color-text-tertiary)', marginBottom: 20 }} />
                <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Your StoreX Cart</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Sign in to view your cart.</p>
                <Link to="/login" className="btn-amazon btn-amazon-buy" style={{ padding: '12px 40px' }}>Sign in</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <span className="spinner" style={{ width: 40, height: 40 }} />
            </div>
        );
    }

    return (
        <motion.div
            className="container"
            style={{ padding: '30px 20px 60px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
                Shopping Cart
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: 24 }}>
                {cart?.items?.length || 0} item{(cart?.items?.length || 0) !== 1 ? 's' : ''} in your cart
            </p>

            {(!cart?.items || cart.items.length === 0) ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', padding: '60px 0' }}
                >
                    <FiPackage size={56} style={{ color: 'var(--color-text-tertiary)', marginBottom: 16 }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Your cart is empty</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Browse products and add items to your cart.</p>
                    <Link to="/products" className="btn-amazon btn-amazon-buy" style={{ padding: '12px 32px' }}>
                        <FiArrowLeft /> Continue Shopping
                    </Link>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
                    <div>
                        <div style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden'
                        }}>
                            <AnimatePresence>
                                {cart.items.map((item, i) => (
                                    <motion.div
                                        key={item.product_name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 20,
                                            padding: '20px 24px',
                                            borderBottom: i < cart.items.length - 1 ? '1px solid var(--color-border)' : 'none'
                                        }}
                                    >
                                        <div style={{
                                            width: 80, height: 80,
                                            background: 'var(--color-bg-tertiary)',
                                            borderRadius: 'var(--radius-sm)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <FiPackage size={28} style={{ color: 'var(--color-text-tertiary)' }} />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: 4, color: 'var(--color-link)' }}>
                                                {item.product_name}
                                            </h4>
                                            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                                                Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                                            </p>
                                        </div>

                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-price)' }}>
                                                ${item.subtotal.toFixed(2)}
                                            </p>
                                            <motion.button
                                                onClick={() => handleRemove(item.product_id)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{
                                                    background: 'none', border: 'none', color: 'var(--color-danger)',
                                                    fontSize: '0.8rem', cursor: 'pointer', marginTop: 6,
                                                    display: 'flex', alignItems: 'center', gap: 4
                                                }}
                                            >
                                                <FiTrash2 size={13} /> Remove
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: 24,
                            position: 'sticky',
                            top: 'calc(var(--total-header-height) + 20px)'
                        }}
                    >
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
                            Order Summary
                        </h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--color-text-secondary)' }}>Items ({cart.items.length}):</span>
                            <span>${cart.total_price.toFixed(2)}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--color-text-secondary)' }}>Shipping:</span>
                            <span style={{ color: 'var(--color-success)' }}>Free</span>
                        </div>

                        <div style={{
                            borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 12,
                            display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem'
                        }}>
                            <span>Order total:</span>
                            <span style={{ color: 'var(--color-price)' }}>${cart.total_price.toFixed(2)}</span>
                        </div>

                        <motion.button
                            className="btn-amazon btn-amazon-buy"
                            style={{ width: '100%', marginTop: 20, padding: '12px', fontSize: '0.95rem' }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toast.success('Checkout coming soon!')}
                        >
                            Proceed to Checkout
                        </motion.button>

                        <Link to="/products" style={{
                            display: 'block', textAlign: 'center', marginTop: 12,
                            color: 'var(--color-link)', fontSize: '0.85rem'
                        }}>
                            Continue Shopping
                        </Link>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
