import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';  // ✅ Добавь импорт
import Login from './pages/Login';
import About from './pages/About';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import CreatorList from './pages/CreatorList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import SellerDashboard from './pages/SellerDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          {/* Global Background Elements */}
          <div className="bg-graffiti-wrap">
            <div className="bg-graffiti-text text-1">MERCH</div>
            <div className="bg-graffiti-text text-2">STREET</div>
            <div className="graffiti-tag" style={{ top: '20%', left: '10%', '--rotation': '-25deg' }}>STYLE</div>
            <div className="graffiti-tag" style={{ top: '60%', left: '60%', '--rotation': '20deg' }}>DROP</div>
            <div className="graffiti-tag" style={{ top: '40%', left: '80%', '--rotation': '-10deg' }}>CORE</div>
          </div>

          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<CreatorList />} />
              <Route path="/shop/creator/:creatorId" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} /> 
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/seller" element={<ProtectedRoute requireSeller><SellerDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;