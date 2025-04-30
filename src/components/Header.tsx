import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-background border-2 border-black fixed w-full top-0 z-50">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-semibold text-primary">
            Family Finance Tracker
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="border-2 border-black hover:bg-purple-100">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-2 border-black">
                <DropdownMenuItem className="hover:bg-purple-100" onSelect={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};