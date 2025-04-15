
// This file contains mock implementations of database queries for client-side development
// In a real application, these would be API calls to a backend service

// Types for our mock database
interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  password: string;
  last_login_at?: string;
  authentication_token?: string;
  created_at?: string;
  updated_at?: string;
}

interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date | string;
  created_at?: string;
  updated_at?: string;
}

interface Budget {
  id: number;
  user_id: number;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  created_at?: string;
  updated_at?: string;
}

interface OTP {
  id: number;
  user_id: number | null;
  contact: string;
  otp_code: string;
  expires_at: Date;
  is_used?: boolean;
  created_at?: string;
}

interface Category {
  id: number;
  name: string;
  icon?: string;
  created_at?: string;
}

// Mock database storage (simulating localStorage)
class MockDatabase {
  private users: User[] = [];
  private transactions: Transaction[] = [];
  private budgets: Budget[] = [];
  private otps: OTP[] = [];
  private categories: Category[] = [];
  private initialized = false;
  
  constructor() {
    this.loadFromLocalStorage();
    
    // Initialize with demo data if empty
    if (!this.initialized) {
      this.initializeDemo();
    }
  }
  
  private loadFromLocalStorage() {
    try {
      const users = localStorage.getItem('mock_db_users');
      const transactions = localStorage.getItem('mock_db_transactions');
      const budgets = localStorage.getItem('mock_db_budgets');
      const otps = localStorage.getItem('mock_db_otps');
      const categories = localStorage.getItem('mock_db_categories');
      
      if (users) this.users = JSON.parse(users);
      if (transactions) this.transactions = JSON.parse(transactions);
      if (budgets) this.budgets = JSON.parse(budgets);
      if (otps) this.otps = JSON.parse(otps);
      if (categories) this.categories = JSON.parse(categories);
      
      this.initialized = !!(users || transactions || budgets || otps || categories);
      
      console.log("Database loaded from localStorage with:", {
        users: this.users.length,
        transactions: this.transactions.length,
        budgets: this.budgets.length,
        otps: this.otps.length,
        categories: this.categories.length
      });
    } catch (error) {
      console.error('Error loading mock database from localStorage:', error);
    }
  }
  
  private saveToLocalStorage() {
    try {
      localStorage.setItem('mock_db_users', JSON.stringify(this.users));
      localStorage.setItem('mock_db_transactions', JSON.stringify(this.transactions));
      localStorage.setItem('mock_db_budgets', JSON.stringify(this.budgets));
      localStorage.setItem('mock_db_otps', JSON.stringify(this.otps));
      localStorage.setItem('mock_db_categories', JSON.stringify(this.categories));
      
      console.log("Database saved to localStorage");
    } catch (error) {
      console.error('Error saving mock database to localStorage:', error);
    }
  }
  
  private initializeDemo() {
    console.log("Initializing demo database");
    
    // Add demo user
    this.users.push({
      id: 1,
      username: 'demo',
      email: 'demo@example.com',
      password: 'password',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Add categories
    const categoryNames = [
      { name: 'Food', icon: 'utensils' },
      { name: 'Transportation', icon: 'car' },
      { name: 'Housing', icon: 'home' },
      { name: 'Entertainment', icon: 'tv' },
      { name: 'Shopping', icon: 'shopping-bag' },
      { name: 'Healthcare', icon: 'activity' },
      { name: 'Education', icon: 'book' },
      { name: 'Utilities', icon: 'zap' },
      { name: 'Travel', icon: 'map' },
      { name: 'Other', icon: 'more-horizontal' }
    ];
    
    categoryNames.forEach((cat, index) => {
      this.categories.push({
        id: index + 1,
        name: cat.name,
        icon: cat.icon,
        created_at: new Date().toISOString()
      });
    });
    
    // Add some demo transactions
    this.transactions.push({
      id: 1,
      user_id: 1,
      amount: -120.50,
      type: 'expense',
      category: 'Food',
      description: 'Grocery Shopping',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      created_at: new Date().toISOString()
    });
    
    this.transactions.push({
      id: 2,
      user_id: 1,
      amount: 3000,
      type: 'income',
      category: 'Income',
      description: 'Salary Deposit',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      created_at: new Date().toISOString()
    });
    
    // Add demo budget
    this.budgets.push({
      id: 1,
      user_id: 1,
      category: 'Food',
      amount: 5000,
      period: 'monthly',
      created_at: new Date().toISOString()
    });
    
    this.saveToLocalStorage();
    this.initialized = true;
    console.log("Demo database initialized");
  }
  
  // User methods
  getUsers(): User[] {
    return this.users;
  }
  
  getUserById(id: number): User | null {
    return this.users.find(u => u.id === id) || null;
  }
  
  getUserByEmail(email: string): User | null {
    return this.users.find(u => u.email === email) || null;
  }
  
  getUserByPhone(phone: string): User | null {
    return this.users.find(u => u.phone === phone) || null;
  }
  
  createUser(username: string, email: string, password: string, phone?: string): User {
    const id = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    
    const newUser: User = {
      id,
      username,
      email,
      password,
      phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.users.push(newUser);
    this.saveToLocalStorage();
    
    console.log("User created:", newUser);
    return newUser;
  }
  
  updateUser(id: number, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    const user = this.users[index];
    const updatedUser = { 
      ...user, 
      ...updates, 
      updated_at: new Date().toISOString()
    };
    
    this.users[index] = updatedUser;
    this.saveToLocalStorage();
    
    console.log("User updated:", updatedUser);
    return updatedUser;
  }
  
  updateLastLogin(id: number): User | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    this.users[index].last_login_at = new Date().toISOString();
    this.users[index].updated_at = new Date().toISOString();
    
    this.saveToLocalStorage();
    return this.users[index];
  }
  
  deleteUser(id: number): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    
    if (this.users.length !== initialLength) {
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }
  
  verifyCredentials(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) {
      // Update last login time
      this.updateLastLogin(user.id);
      return user;
    }
    return null;
  }
  
  // Transaction methods
  getTransactions(): Transaction[] {
    return this.transactions;
  }
  
  getTransactionsByUserId(userId: number): Transaction[] {
    return this.transactions.filter(t => t.user_id === userId);
  }
  
  getTransactionById(id: number): Transaction | null {
    return this.transactions.find(t => t.id === id) || null;
  }
  
  createTransaction(
    user_id: number,
    amount: number,
    type: 'income' | 'expense',
    category: string,
    description: string,
    date: Date
  ): Transaction {
    const id = this.transactions.length > 0 ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1;
    
    const newTransaction: Transaction = {
      id,
      user_id,
      amount,
      type,
      category,
      description,
      date: date.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.transactions.push(newTransaction);
    this.saveToLocalStorage();
    
    console.log("Transaction created:", newTransaction);
    return newTransaction;
  }
  
  updateTransaction(
    id: number,
    updates: Partial<Transaction>
  ): Transaction | null {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    const transaction = this.transactions[index];
    const updatedTransaction = { 
      ...transaction, 
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.transactions[index] = updatedTransaction;
    this.saveToLocalStorage();
    
    console.log("Transaction updated:", updatedTransaction);
    return updatedTransaction;
  }
  
  deleteTransaction(id: number): boolean {
    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter(t => t.id !== id);
    
    if (this.transactions.length !== initialLength) {
      this.saveToLocalStorage();
      console.log("Transaction deleted:", id);
      return true;
    }
    
    return false;
  }
  
  // Budget methods
  getBudgets(): Budget[] {
    return this.budgets;
  }
  
  getBudgetsByUserId(userId: number): Budget[] {
    return this.budgets.filter(b => b.user_id === userId);
  }
  
  createBudget(
    user_id: number,
    category: string,
    amount: number,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ): Budget {
    const id = this.budgets.length > 0 ? Math.max(...this.budgets.map(b => b.id)) + 1 : 1;
    
    const newBudget: Budget = {
      id,
      user_id,
      category,
      amount,
      period,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.budgets.push(newBudget);
    this.saveToLocalStorage();
    
    console.log("Budget created:", newBudget);
    return newBudget;
  }
  
  updateBudget(
    id: number,
    updates: Partial<Budget>
  ): Budget | null {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    const budget = this.budgets[index];
    const updatedBudget = { 
      ...budget, 
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    this.budgets[index] = updatedBudget;
    this.saveToLocalStorage();
    
    console.log("Budget updated:", updatedBudget);
    return updatedBudget;
  }
  
  deleteBudget(id: number): boolean {
    const initialLength = this.budgets.length;
    this.budgets = this.budgets.filter(b => b.id !== id);
    
    if (this.budgets.length !== initialLength) {
      this.saveToLocalStorage();
      console.log("Budget deleted:", id);
      return true;
    }
    
    return false;
  }
  
  // OTP methods
  storeOTP(
    user_id: number | null,
    contact: string,
    otp_code: string,
    expires_at: Date
  ): OTP {
    const id = this.otps.length > 0 ? Math.max(...this.otps.map(o => o.id)) + 1 : 1;
    
    const newOTP: OTP = {
      id,
      user_id,
      contact,
      otp_code,
      expires_at,
      is_used: false,
      created_at: new Date().toISOString()
    };
    
    this.otps.push(newOTP);
    this.saveToLocalStorage();
    
    console.log("OTP stored:", newOTP);
    return newOTP;
  }
  
  getOTPByContact(contact: string): OTP | null {
    // Get the most recent non-expired OTP
    const now = new Date();
    
    return this.otps
      .filter(o => o.contact === contact && new Date(o.expires_at) > now && !o.is_used)
      .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())[0] || null;
  }
  
  markOTPAsUsed(id: number): boolean {
    const otp = this.otps.find(o => o.id === id);
    if (!otp) return false;
    
    otp.is_used = true;
    this.saveToLocalStorage();
    
    console.log("OTP marked as used:", id);
    return true;
  }
  
  deleteOTP(id: number): boolean {
    const initialLength = this.otps.length;
    this.otps = this.otps.filter(o => o.id !== id);
    
    if (this.otps.length !== initialLength) {
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }
  
  // Category methods
  getCategories(): Category[] {
    return this.categories;
  }
  
  getCategoryById(id: number): Category | null {
    return this.categories.find(c => c.id === id) || null;
  }
}

// Create a singleton instance
const db = new MockDatabase();

// Exported functions to match the API of the original database_queries.ts
export async function getAllUsers() {
  return db.getUsers();
}

export async function getUserByEmail(email: string) {
  return db.getUserByEmail(email);
}

export async function getUserByPhone(phone: string) {
  return db.getUserByPhone(phone);
}

export async function createUser(username: string, email: string, password: string, phone?: string) {
  return db.createUser(username, email, password, phone);
}

export async function verifyCredentials(email: string, password: string) {
  return db.verifyCredentials(email, password);
}

export async function updateUserProfile(userId: number, username: string, email: string, phone?: string) {
  return db.updateUser(userId, { username, email, phone });
}

export async function updatePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = db.getUserById(userId);
  
  // Verify current password
  if (!user || user.password !== currentPassword) {
    return false;
  }
  
  // Update password
  const updated = db.updateUser(userId, { password: newPassword });
  return !!updated;
}

export async function createTransaction(
  userId: number, 
  amount: number, 
  type: 'income' | 'expense', 
  category: string, 
  description: string, 
  date: Date
) {
  return db.createTransaction(userId, amount, type, category, description, date);
}

export async function getTransactionsByUserId(userId: number) {
  return db.getTransactionsByUserId(userId);
}

export async function updateTransaction(transactionId: number, updates: Partial<Transaction>) {
  return db.updateTransaction(transactionId, updates);
}

export async function deleteTransaction(transactionId: number) {
  return db.deleteTransaction(transactionId);
}

export async function createBudget(
  userId: number,
  category: string,
  amount: number,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
) {
  return db.createBudget(userId, category, amount, period);
}

export async function getBudgetsByUserId(userId: number) {
  return db.getBudgetsByUserId(userId);
}

export async function updateBudget(
  budgetId: number,
  updates: Partial<Budget>
) {
  return db.updateBudget(budgetId, updates);
}

export async function deleteBudget(budgetId: number) {
  return db.deleteBudget(budgetId);
}

export async function storeOTP(
  userId: number | null,
  contact: string,
  otpCode: string,
  expiresAt: Date
) {
  return db.storeOTP(userId, contact, otpCode, expiresAt);
}

export async function getOTPByContact(contact: string) {
  return db.getOTPByContact(contact);
}

export async function verifyOTP(contact: string, otpCode: string) {
  const otp = db.getOTPByContact(contact);
  
  if (otp && otp.otp_code === otpCode) {
    // Mark OTP as used
    db.markOTPAsUsed(otp.id);
    return true;
  }
  
  return false;
}

export async function initializeDatabase() {
  // The mock database is initialized when created
  console.log("Database initialization completed");
  return true;
}

// Export the DB schema for reference
export const DATABASE_SCHEMA = {
  tables: {
    users: {
      fields: [
        { name: 'id', type: 'INT', isPrimary: true, autoIncrement: true },
        { name: 'username', type: 'VARCHAR(255)', isRequired: true },
        { name: 'email', type: 'VARCHAR(255)', isRequired: true, isUnique: true },
        { name: 'phone', type: 'VARCHAR(20)' },
        { name: 'password', type: 'VARCHAR(255)', isRequired: true },
        { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
      ]
    },
    otps: {
      fields: [
        { name: 'id', type: 'INT', isPrimary: true, autoIncrement: true },
        { name: 'user_id', type: 'INT', foreignKey: { table: 'users', field: 'id' } },
        { name: 'contact', type: 'VARCHAR(255)', isRequired: true },
        { name: 'otp_code', type: 'VARCHAR(10)', isRequired: true },
        { name: 'expires_at', type: 'DATETIME', isRequired: true },
        { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
      ]
    },
    transactions: {
      fields: [
        { name: 'id', type: 'INT', isPrimary: true, autoIncrement: true },
        { name: 'user_id', type: 'INT', isRequired: true, foreignKey: { table: 'users', field: 'id' } },
        { name: 'amount', type: 'DECIMAL(10,2)', isRequired: true },
        { name: 'type', type: "ENUM('income', 'expense')", isRequired: true },
        { name: 'category', type: 'VARCHAR(255)', isRequired: true },
        { name: 'description', type: 'TEXT' },
        { name: 'date', type: 'DATE', isRequired: true },
        { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
      ]
    },
    budgets: {
      fields: [
        { name: 'id', type: 'INT', isPrimary: true, autoIncrement: true },
        { name: 'user_id', type: 'INT', isRequired: true, foreignKey: { table: 'users', field: 'id' } },
        { name: 'category', type: 'VARCHAR(255)', isRequired: true },
        { name: 'amount', type: 'DECIMAL(10,2)', isRequired: true },
        { name: 'period', type: "ENUM('daily', 'weekly', 'monthly', 'yearly')", isRequired: true },
        { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
      ]
    },
    categories: {
      fields: [
        { name: 'id', type: 'INT', isPrimary: true, autoIncrement: true },
        { name: 'name', type: 'VARCHAR(255)', isRequired: true },
        { name: 'icon', type: 'VARCHAR(255)' },
        { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
      ]
    }
  }
};
