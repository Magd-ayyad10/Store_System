import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FiPackage, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories, likeProduct, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const querySearch = searchParams.get('q') || '';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories(),
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (productId) => {
        if (!isAuthenticated) {
            toast.error('Please sign in to like products');
            return;
        }
        try {
            await likeProduct(user.id, productId);
            toast.success('Product liked! ❤️');
        } catch {
            toast.error('Failed to like product');
        }
    };

    const handleAddToCart = async (productId) => {
        if (!isAuthenticated) {
            toast.error('Please sign in to add items to cart');
            return;
        }
        try {
            await addToCart(user.id, productId);
            toast.success('Added to cart! 🛒');
        } catch {
            toast.error('Failed to add to cart');
        }
    };

    const filteredProducts = products.filter((p) => {
        const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
        const matchesSearch = querySearch
            ? p.name?.toLowerCase().includes(querySearch.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });

    const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'];
    const [sortBy, setSortBy] = useState('Featured');

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'Price: Low to High') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'Price: High to Low') return (b.price || 0) - (a.price || 0);
        return 0;
    });

    return (
        <div className="page-layout">
            {/* Sidebar */}
            <aside className="sidebar-filters">
                <div className="filter-section">
                    <div className="filter-title">Department</div>
                    <button
                        className={`filter-option ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        All Products
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`filter-option ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="filter-section">
                    <div className="filter-title">Availability</div>
                    <button className="filter-option active">
                        Include Out of Stock
                    </button>
                </div>

                <div className="filter-section">
                    <div className="filter-title">Condition</div>
                    <button className="filter-option active">New</button>
                    <button className="filter-option">Renewed</button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                {/* Results bar */}
                <div className="results-bar">
                    <span className="results-count">
                        {querySearch ? (
                            <>Results for "<strong>{querySearch}</strong>"</>
                        ) : (
                            <><strong>{sortedProducts.length}</strong> results</>
                        )}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label htmlFor="sort-select" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Sort by:</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '6px 10px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-secondary)',
                                color: 'var(--color-text-primary)',
                                fontSize: '0.85rem',
                            }}
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner" />
                        <p style={{ color: 'var(--color-text-tertiary)' }}>Loading products...</p>
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="empty-icon"><FiPackage /></div>
                        <h3>No products found</h3>
                        <p>Try adjusting your filters or search query.</p>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            className="products-grid"
                            key={`${selectedCategory}-${querySearch}-${sortBy}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {sortedProducts.map((product, i) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={i}
                                    onLike={handleLike}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
