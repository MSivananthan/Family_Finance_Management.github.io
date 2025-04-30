import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#003366]">
      {/* Header */}
      <header className="fixed w-full top-0 z-50">
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
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Unified Family
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-[#ffcc00]">
              Finance Tracker
            </h2>
            <div className="space-y-4 text-lg text-white">
              <p>Welcome to Unified Family Finance Tracker!</p>
              <p>We're here to empower your family with tools to manage finances effortlessly.</p>
              <p>Track expenses, set budgets, achieve savings goals, and collaborate with family members.</p>
              <p>Join us today and take control of your financial future. Sign up now!</p>
            </div>
            
            <Button 
              className="bg-[#00d1ff] hover:bg-[#007ab3] text-[#003366] text-lg px-8 py-6"
              asChild
            >
              <Link to="/signup">Let's Start</Link>
            </Button>
          </motion.div>

          {/* Image Section */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="/lovable-uploads/c783faec-c8be-4e24-8bde-197ce63ccc66.png"
              alt="Finance Management"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </motion.div>

          {/* Quote */}
          <div className="mt-16 text-left">
            <p className="text-2xl font-semibold text-[#ffcc00]">
              "The art is not in making money, but in keeping it."
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

export default Index;