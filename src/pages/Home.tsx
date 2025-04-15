import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Typed from "typed.js";

const Home = () => {
  const quoteRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(quoteRef.current, {
      strings: ['"The art is not in making money, but in keeping it."'],
      typeSpeed: 50,
      showCursor: true,
      cursorChar: '|',
      loop: false
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#003366] text-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-[#003366]">
        <div className="flex justify-end p-5">
          <nav className="space-x-4">
            <Link 
              to="/login" 
              className="text-[#00d1ff] font-bold hover:text-[#007ab3] transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-[#00d1ff] text-[#003366] px-5 py-2.5 rounded font-bold uppercase hover:bg-[#007ab3] transition-colors"
            >
              Signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-5 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Text Content - Left Side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left space-y-6 order-1"
            >
              <h1 className="text-4xl md:text-5xl font-bold">
                Unified Family
              </h1>
              <h4 className="text-4xl md:text-5xl font-bold text-[#ffcc00]">
                Finance Tracker
              </h4>
              <div className="space-y-4 text-lg">
                <p>Welcome to Unified Family Finance Tracker!</p>
                <p>We're here to empower your family with tools to manage finances effortlessly.</p>
                <p>Track expenses, set budgets, achieve savings goals, and collaborate with family members.</p>
                <p>Join us today and take control of your financial future. Sign up now!</p>
              </div>
              
              <Link 
                to="/signup"
                className="inline-block bg-[#00d1ff] hover:bg-[#007ab3] text-[#003366] text-lg px-8 py-3 rounded transition-colors"
              >
                Let's Start
              </Link>
            </motion.div>

            {/* Image Section - Right Side */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2"
            >
              <img
                src="/lovable-uploads/b02f6622-ecbf-4850-866a-39ccb53aac6e.png"
                alt="Finance Management"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>
          </div>

          {/* Quote */}
          <div className="mt-16 text-center">
            <p className="text-2xl font-semibold text-[#ffcc00]">
              <span ref={quoteRef}></span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 text-center text-white/60">
        <p>© {new Date().getFullYear()} Made by Sivananthan</p>
      </footer>
    </div>
  );
};

export default Home;