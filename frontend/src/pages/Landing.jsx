import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingBag, FiZap, FiShield, FiHeart, FiTruck, FiClock, FiStar } from 'react-icons/fi';
import HeroScene from '../components/three/HeroScene';

const infoCards = [
    {
        icon: <FiTruck />,
        title: 'Free Shipping',
        desc: 'Free delivery on orders over $25 shipped by StoreX.',
    },
    {
        icon: <FiShield />,
        title: 'Secure Payments',
        desc: 'JWT-based auth with encrypted password storage.',
    },
    {
        icon: <FiClock />,
        title: 'Fast Delivery',
        desc: 'Lightning fast API responses and real-time updates.',
    },
    {
        icon: <FiStar />,
        title: 'Top Rated',
        desc: 'Like your favorite products and build your wishlist.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export default function Landing() {
    return (
        <>
            {/* Hero Banner with 3D Scene */}
            <section className="hero-banner">
                <div className="hero-banner-canvas">
                    <Suspense fallback={null}>
                        <HeroScene />
                    </Suspense>
                </div>
                <div className="hero-banner-overlay" />

                <motion.div
                    className="hero-banner-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <h1>Shop the Future with Store<span style={{ color: '#ff9900' }}>X</span></h1>
                    <p>
                        Discover amazing products, manage your store, and enjoy a modern
                        shopping experience powered by cutting-edge technology.
                    </p>
                    <div>
                        <Link to="/products">
                            <motion.button
                                className="hero-btn hero-btn-primary"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Shop now <FiArrowRight />
                            </motion.button>
                        </Link>
                        <Link to="/register">
                            <motion.button
                                className="hero-btn hero-btn-secondary"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Sign up free
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Info Cards Row (overlaps hero) */}
            <motion.div
                className="hero-cards-row"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {infoCards.map((card, i) => (
                    <motion.div key={i} className="hero-info-card" variants={itemVariants}>
                        <div className="card-icon">{card.icon}</div>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Deal of the Day Section */}
            <section style={{ padding: '40px 20px 60px', maxWidth: 1500, margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>
                            Deal of the Day
                        </h2>
                        <span style={{ color: 'var(--color-deal)', fontWeight: 600, fontSize: '0.88rem' }}>
                            Limited time offer
                        </span>
                    </div>

                    <div style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 32,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 40,
                        flexWrap: 'wrap',
                    }}>
                        <div style={{
                            width: 200,
                            height: 200,
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                style={{ fontSize: '4rem', color: 'var(--color-accent-primary)', opacity: 0.5 }}
                            >
                                <FiShoppingBag />
                            </motion.div>
                        </div>
                        <div style={{ flex: 1, minWidth: 250 }}>
                            <div style={{
                                display: 'inline-block',
                                background: 'var(--color-deal)',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                marginBottom: 12,
                            }}>
                                Up to 40% off
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                                Explore all products on StoreX
                            </h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: 20, lineHeight: 1.6 }}>
                                Browse our full catalog of products managed through our powerful FastAPI backend.
                                Sign up to create products, manage categories, and like your favorites.
                            </p>
                            <Link to="/products">
                                <motion.button
                                    className="btn-amazon btn-amazon-primary"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ padding: '10px 28px' }}
                                >
                                    See all deals <FiArrowRight />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Sign Up CTA */}
            <section style={{ padding: '0 20px 60px', maxWidth: 1500, margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        background: 'var(--color-navbar-secondary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '40px 32px',
                        textAlign: 'center',
                    }}
                >
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                        Sign in for the best experience
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24, fontSize: '0.92rem' }}>
                        Sign in to manage products, like items, and access your dashboard.
                    </p>
                    <Link to="/login">
                        <motion.button
                            className="btn-amazon btn-amazon-buy"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            style={{ padding: '12px 36px', fontSize: '0.95rem' }}
                        >
                            Sign in securely
                        </motion.button>
                    </Link>
                </motion.div>
            </section>
        </>
    );
}
