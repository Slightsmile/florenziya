import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import { useCart } from "./context/CartContext";

const Home = lazy(() => import("./pages/Home"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-24 text-ink/50" role="status">
      Loading…
    </div>
  );
}

export default function App() {
  const { isCartOpen, closeCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:bg-ink focus:text-cream focus:px-4 focus:py-2 focus:rounded-full text-sm"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Navigate to="/" replace />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CartSidebar open={isCartOpen} onClose={closeCart} />
    </div>
  );
}
