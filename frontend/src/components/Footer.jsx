import { Link } from 'react-router-dom';

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer>
            <div className="footer-back-top" onClick={scrollToTop} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollToTop()}>
                Back to top
            </div>
            <div className="footer-main">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Get to Know Us</h4>
                        <Link to="/">About StoreX</Link>
                        <Link to="/">Careers</Link>
                        <Link to="/">Press Releases</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Make Money with Us</h4>
                        <Link to="/dashboard">Sell products on StoreX</Link>
                        <Link to="/">Become an Affiliate</Link>
                        <Link to="/">Advertise Your Products</Link>
                    </div>
                    <div className="footer-col">
                        <h4>StoreX Payment</h4>
                        <Link to="/">Business Card</Link>
                        <Link to="/">Shop with Points</Link>
                        <Link to="/">Reload Your Balance</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Let Us Help You</h4>
                        <Link to="/login">Your Account</Link>
                        <Link to="/products">Your Orders</Link>
                        <Link to="/">Returns & Replacements</Link>
                        <Link to="/">Help</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div style={{ marginBottom: 6, fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                    Store<span style={{ color: '#ff9900' }}>X</span>
                </div>
                © {new Date().getFullYear()} StoreX — Built with ❤️ by Magd
            </div>
        </footer>
    );
}
