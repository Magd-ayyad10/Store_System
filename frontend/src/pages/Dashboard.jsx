import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiPackage, FiTag, FiPlus, FiTrash2, FiUpload,
    FiShoppingBag, FiGrid, FiTrendingUp,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
    getProducts, getCategories, createProduct, createCategory, deleteCategory,
} from '../services/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [productForm, setProductForm] = useState({ name: '', price: '', stock: '', category_id: '' });
    const [productImage, setProductImage] = useState(null);
    const [creatingProduct, setCreatingProduct] = useState(false);

    const [categoryName, setCategoryName] = useState('');
    const [creatingCategory, setCreatingCategory] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
            setProducts(prods);
            setCategories(cats);
        } catch { toast.error('Failed to load data'); }
        finally { setLoading(false); }
    };

    const handleProductChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        if (!productForm.name || !productForm.price || !productForm.stock || !productForm.category_id) {
            toast.error('Please fill in all product fields'); return;
        }
        if (!productImage) { toast.error('Please upload a product image'); return; }

        setCreatingProduct(true);
        try {
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('price', parseFloat(productForm.price));
            formData.append('stock', parseInt(productForm.stock));
            formData.append('category_id', parseInt(productForm.category_id));
            formData.append('image', productImage);
            await createProduct(formData);
            toast.success('Product created! 🎉');
            setProductForm({ name: '', price: '', stock: '', category_id: '' });
            setProductImage(null);
            fetchData();
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed to create product'); }
        finally { setCreatingProduct(false); }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) { toast.error('Category name is required'); return; }
        setCreatingCategory(true);
        try {
            await createCategory({ name: categoryName });
            toast.success('Category created! ✅');
            setCategoryName('');
            fetchData();
        } catch (err) { toast.error(err.response?.data?.detail || 'Failed to create category'); }
        finally { setCreatingCategory(false); }
    };

    const handleDeleteCategory = async (catId) => {
        if (!window.confirm('Delete this category?')) return;
        try { await deleteCategory(catId); toast.success('Category deleted'); fetchData(); }
        catch { toast.error('Failed to delete category'); }
    };

    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const avgPrice = products.length ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length).toFixed(0) : 0;

    const stats = [
        { icon: <FiPackage />, value: products.length, label: 'Total Products', bg: '#ff9900' },
        { icon: <FiGrid />, value: categories.length, label: 'Categories', bg: '#007185' },
        { icon: <FiShoppingBag />, value: totalStock.toLocaleString(), label: 'Total Stock', bg: '#c7511f' },
        { icon: <FiTrendingUp />, value: `$${avgPrice}`, label: 'Avg. Price', bg: '#007600' },
    ];

    if (loading) {
        return (
            <div className="page-section"><div className="container">
                <div className="loading-container"><div className="spinner" /></div>
            </div></div>
        );
    }

    return (
        <div className="page-section">
            <div className="container">
                <motion.div className="page-header" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>Seller Dashboard</h1>
                    <p>Manage your store products and categories</p>
                </motion.div>

                {/* Stats */}
                <motion.div className="dashboard-grid" variants={containerVariants} initial="hidden" animate="visible">
                    {stats.map((stat, i) => (
                        <motion.div key={i} className="stat-card" variants={itemVariants}>
                            <div className="stat-icon" style={{ background: stat.bg }}>{stat.icon}</div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Create Product Form */}
                <motion.div className="dashboard-form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3><FiPlus style={{ color: 'var(--color-accent-primary)' }} /> Add New Product</h3>
                    <form onSubmit={handleCreateProduct}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input className="form-input" type="text" name="name" placeholder="e.g. Wireless Headphones" value={productForm.name} onChange={handleProductChange} />
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input className="form-input" type="number" name="price" placeholder="99" value={productForm.price} onChange={handleProductChange} />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input className="form-input" type="number" name="stock" placeholder="50" value={productForm.stock} onChange={handleProductChange} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select className="form-input" name="category_id" value={productForm.category_id} onChange={handleProductChange}>
                                    <option value="">Select category</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: 8 }}>
                            <label><FiUpload style={{ marginRight: 4, verticalAlign: 'middle' }} /> Product Image</label>
                            <input className="form-input" type="file" accept="image/*" onChange={(e) => setProductImage(e.target.files[0])} style={{ padding: 8 }} />
                            {productImage && <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: 4 }}>✓ {productImage.name}</p>}
                        </div>
                        <div className="form-actions">
                            <motion.button type="submit" className="btn-amazon btn-amazon-buy" disabled={creatingProduct} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {creatingProduct ? '...' : <><FiPlus /> Create Product</>}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                {/* Create Category */}
                <motion.div className="dashboard-form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h3><FiTag style={{ color: 'var(--color-accent-primary)' }} /> Add Category</h3>
                    <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label>Category Name</label>
                            <input className="form-input" type="text" placeholder="e.g. Electronics" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                        </div>
                        <motion.button type="submit" className="btn-amazon btn-amazon-buy" disabled={creatingCategory} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ height: 42 }}>
                            {creatingCategory ? '...' : <><FiPlus /> Add</>}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Categories Table */}
                <motion.div className="data-table-wrapper" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="data-table-header">
                        <h3><FiTag style={{ marginRight: 6, verticalAlign: 'middle' }} /> Categories</h3>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-tertiary)' }}>{categories.length} total</span>
                    </div>
                    {categories.length > 0 ? (
                        <table className="data-table">
                            <thead><tr><th>ID</th><th>Name</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td style={{ fontWeight: 600 }}>#{cat.id}</td>
                                        <td>{cat.name}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <motion.button className="btn-danger" onClick={() => handleDeleteCategory(cat.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <FiTrash2 style={{ marginRight: 4 }} /> Delete
                                            </motion.button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <div className="empty-state" style={{ padding: 30 }}><p>No categories yet.</p></div>}
                </motion.div>

                {/* Products Table */}
                <motion.div className="data-table-wrapper" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <div className="data-table-header">
                        <h3><FiPackage style={{ marginRight: 6, verticalAlign: 'middle' }} /> Products</h3>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-tertiary)' }}>{products.length} total</span>
                    </div>
                    {products.length > 0 ? (
                        <table className="data-table">
                            <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th></tr></thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 600 }}>#{p.id}</td>
                                        <td style={{ color: 'var(--color-link)' }}>{p.name}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--color-price)' }}>${p.price?.toLocaleString()}</td>
                                        <td><span className={p.stock > 0 ? 'stock-in' : 'stock-out'}>{p.stock}</span></td>
                                        <td>{categories.find((c) => c.id === p.category_id)?.name || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <div className="empty-state" style={{ padding: 30 }}><p>No products yet.</p></div>}
                </motion.div>
            </div>
        </div>
    );
}
