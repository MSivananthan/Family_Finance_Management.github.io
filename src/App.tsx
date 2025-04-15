
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { isAuthenticated } from "./hooks/useAuth";

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [initializing, setInitializing] = useState(true);

  // Initialize the database and auth state
  useEffect(() => {
    const initApp = async () => {
      try {
        // Load any persistent data from localStorage if needed
        console.log("Initializing app and checking authentication state");
        
        // Check for any stored transactions and make sure they're in the right format
        const transactions = JSON.parse(localStorage.getItem('mock_db_transactions') || '[]');
        console.log(`Found ${transactions.length} transactions in storage`);
        
        // Check for any stored budgets
        const budgets = JSON.parse(localStorage.getItem('mock_db_budgets') || '[]');
        console.log(`Found ${budgets.length} budgets in storage`);
        
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setInitializing(false);
      }
    };
    
    initApp();
  }, []);

  if (initializing) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } />
            <Route path="/budget" element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
