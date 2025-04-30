import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, PieChart, Settings, Wallet2 } from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: Receipt },
    { path: "/budget", label: "Budget", icon: Wallet2 },
    { path: "/reports", label: "Reports", icon: PieChart },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};