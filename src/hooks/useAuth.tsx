
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  isAuthenticated?: boolean;
  lastLoginAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  verifyAuthentication: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        console.log("Setting user:", user);
        
        // Update the authentication status
        const isAuthenticated = !!user;
        const authenticatedUser = user ? {
          ...user,
          isAuthenticated,
          lastLoginAt: new Date().toISOString()
        } : null;
        
        set({ user: authenticatedUser, isAuthenticated });
        
        // Update localStorage directly for compatibility with mock DB
        if (user) {
          const mockUsers = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
          const existingUserIndex = mockUsers.findIndex((u: any) => u.id === user.id);
          
          if (existingUserIndex >= 0) {
            mockUsers[existingUserIndex] = {
              ...mockUsers[existingUserIndex],
              username: user.name,
              email: user.email || mockUsers[existingUserIndex].email,
              phone: user.phone || mockUsers[existingUserIndex].phone,
              last_login_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            localStorage.setItem('mock_db_users', JSON.stringify(mockUsers));
            console.log("Updated user in mock database:", mockUsers[existingUserIndex]);
          }
        }
      },
      updateUser: (userData) => {
        console.log("Updating user with:", userData);
        set((state) => {
          if (!state.user) return state;
          
          const updatedUser = {
            ...state.user,
            ...userData
          };
          
          // Update localStorage directly for compatibility with mock DB
          const mockUsers = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
          const existingUserIndex = mockUsers.findIndex((u: any) => u.id === state.user?.id);
          
          if (existingUserIndex >= 0) {
            mockUsers[existingUserIndex] = {
              ...mockUsers[existingUserIndex],
              username: updatedUser.name,
              email: updatedUser.email || mockUsers[existingUserIndex].email,
              phone: updatedUser.phone || mockUsers[existingUserIndex].phone,
              updated_at: new Date().toISOString()
            };
            localStorage.setItem('mock_db_users', JSON.stringify(mockUsers));
            console.log("Updated user in mock database:", mockUsers[existingUserIndex]);
          }
          
          return { user: updatedUser };
        });
      },
      logout: () => {
        console.log("Logging out");
        set({ user: null, isAuthenticated: false });
      },
      verifyAuthentication: () => {
        const state = get();
        return state.isAuthenticated && !!state.user;
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage
      skipHydration: false, // ensure hydration happens
    }
  )
);

// Export a helper function to get current user ID safely
export const getCurrentUserId = (): number | null => {
  const state = useAuth.getState();
  return state.user?.id || null;
};

// Helper function to check if a user is authenticated
export const isAuthenticated = (): boolean => {
  const state = useAuth.getState();
  return state.verifyAuthentication();
};
