import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiStar, FiShoppingBag, FiCheck, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProduct, getCategories, likeProduct, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const [productData, catData] = await Promise.all([
                getProduct(id),
                getCategories(),
            ]);
            setProduct(productData);
            setCategories(catData);
        } catch {
            toast.error('Product not found');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (catId) => {
        const cat = categories.find((c) => c.id === catId);
        return cat ? cat.name : 'Uncategorized';
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to like products');
            return;
        }
        try {
            await likeProduct(user.id, product.id);
            toast.success('Added to favorites! ❤️');
        } catch {
            toast.error('Failed to like product');
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to add to cart');
            return;
        }
        try {
            await addToCart(user.id, product.id);
            toast.success('Added to cart! 🛒');
        } catch {
            toast.error('Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="product-detail">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const hasImage = product.cover_image_url && product.cover_image_url !== 'null';
    const pseudoRating = ((product.id || 0) % 3) + 3;
    const pseudoCount = ((product.id || 1) * 127 + 83) % 5000 + 50;

    return (
        <div className="product-detail">
            <div className="container">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: 16 }}>
                    <Link to="/products" className="btn-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <FiArrowLeft /> Back to results
                    </Link>
                </motion.div>

                <div className="product-detail-grid">
                    {/* Image */}
                    <motion.div
                        className="product-detail-image"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {hasImage ? (
                            <img src={product.cover_image_url} alt={product.name} />
                        ) : (
                            <motion.div
                                className="placeholder-icon"
                                animate={{ rotate: [0, 3, -3, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                            >
                                <FiShoppingBag />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        className="product-detail-info"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h1>{product.name}</h1>

                        <div className="detail-rating">
                            <span style={{ color: 'var(--color-link)', fontSize: '0.88rem', marginRight: 4 }}>{pseudoRating}.0</span>
                            <div className="stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FiStar key={i} style={{ fill: i < pseudoRating ? '#de7921' : 'none', color: '#de7921', fontSize: '1rem' }} />
                                ))}
                            </div>
                            <span className="rating-count" style={{ marginLeft: 6 }}>
                                {pseudoCount.toLocaleString()} ratings
                            </span>
                        </div>

                        <div className="detail-price-box">
                            <div className="detail-price-label">Price:</div>
                            <div className="detail-price-value">
                                <span style={{ fontSize: '0.9rem', verticalAlign: 'super' }}>$</span>
                                {product.price?.toLocaleString()}
                            </div>
                        </div>

                        <p className="detail-description">
                            {product.description || 'This product does not have a description yet. Check back later for more details about this amazing item!'}
                        </p>

                        <div className="detail-meta">
                            <div className="detail-meta-row">
                                <span className="meta-key">Category</span>
                                <span className="meta-val">{getCategoryName(product.category_id)}</span>
                            </div>
                            <div className="detail-meta-row">
                                <span className="meta-key">Product ID</span>
                                <span className="meta-val">#{product.id}</span>
                            </div>
                            <div className="detail-meta-row">
                                <span className="meta-key">Stock</span>
                                <span className="meta-val">
                                    {product.stock > 0
                                        ? <span className="stock-in">{product.stock} units available</span>
                                        : <span className="stock-out">Currently unavailable</span>
                                    }
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Buy Box */}
                    <motion.div
                        className="buy-box"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="buy-price">
                            <span style={{ fontSize: '0.85rem', verticalAlign: 'super' }}>$</span>
                            {product.price?.toLocaleString()}
                        </div>

                        <div className="buy-stock" style={{ marginBottom: 6 }}>
                            {product.stock > 0 ? (
                                <span className="stock-in"><FiCheck style={{ verticalAlign: 'middle' }} /> In Stock</span>
                            ) : (
                                <span className="stock-out">Out of Stock</span>
                            )}
                        </div>

                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                            Ships from and sold by <strong>StoreX</strong>
                        </p>

                        <div className="buy-actions">
                            <motion.button
                                className="btn-amazon btn-amazon-buy"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLike}
                            >
                                <FiHeart /> Add to Favorites
                            </motion.button>
                            <motion.button
                                className="btn-amazon btn-amazon-cart"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </motion.button>
                        </div>

                        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                            <FiShield style={{ color: 'var(--color-link)' }} />
                            <span>Secure transaction</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
