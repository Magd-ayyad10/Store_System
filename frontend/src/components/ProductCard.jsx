import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingBag, FiHeart, FiShoppingCart } from 'react-icons/fi';

function StarRating({ rating = 4, count }) {
    return (
        <div className="product-card-rating">
            <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                        key={i}
                        style={{
                            fill: i < rating ? '#de7921' : 'none',
                            color: '#de7921',
                        }}
                    />
                ))}
            </div>
            {count !== undefined && (
                <span className="rating-count">{count.toLocaleString()}</span>
            )}
        </div>
    );
}

export default function ProductCard({ product, index = 0, onLike, onAddToCart }) {
    const hasImage = product.cover_image_url && product.cover_image_url !== 'null';
    const pseudoRating = ((product.id || 0) % 3) + 3;
    const pseudoCount = ((product.id || 1) * 127 + 83) % 5000 + 50;

    const isDeal = product.id % 4 === 0;
    const dealPercent = isDeal ? ((product.id * 7 + 13) % 40 + 10) : 0;

    return (
        <motion.div
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {isDeal && <div className="product-card-badge">{dealPercent}% off</div>}

            <Link to={`/products/${product.id}`}>
                <div className="product-card-image">
                    {hasImage ? (
                        <img src={product.cover_image_url} alt={product.name} loading="lazy" />
                    ) : (
                        <motion.div
                            className="placeholder-icon"
                            animate={{ rotate: [0, 3, -3, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <FiShoppingBag />
                        </motion.div>
                    )}
                </div>
            </Link>

            <div className="product-card-body">
                <Link to={`/products/${product.id}`}>
                    <div className="product-title">{product.name}</div>
                </Link>

                <StarRating rating={pseudoRating} count={pseudoCount} />

                <div className="product-card-price">
                    <span className="price-symbol">$</span>
                    <span className="price-whole">{product.price?.toLocaleString()}</span>
                </div>

                <div className="product-card-stock">
                    {product.stock > 0 ? (
                        <span className="stock-in">In Stock</span>
                    ) : (
                        <span className="stock-out">Out of Stock</span>
                    )}
                </div>

                <div className="product-card-actions">
                    <motion.button
                        className="btn-amazon btn-amazon-buy"
                        style={{ flex: 1, fontSize: '0.82rem', padding: '7px 10px' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.preventDefault();
                            if (onAddToCart) onAddToCart(product.id);
                        }}
                    >
                        <FiShoppingCart /> Add to Cart
                    </motion.button>
                    <motion.button
                        className="btn-amazon btn-amazon-secondary"
                        style={{ fontSize: '0.82rem', padding: '7px 10px' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.preventDefault();
                            if (onLike) onLike(product.id);
                        }}
                    >
                        <FiHeart />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
