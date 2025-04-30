// This is a mock implementation of MySQL functionality for the browser
// In a real application, this would be handled by a backend API

// Database configuration object
export const DB_CONFIG = {
  database: 'family_finance',
  user: 'Siva',
  password: '@Sivananthan46'
};

// Helper function to get data from localStorage
function getStorageData(key: string, defaultValue: any[] = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Helper function to save data to localStorage
function saveStorageData(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
}

// Initialize database with schema and default data
function initializeDatabase() {
  console.log("Checking if database needs initialization...");
  
  // Initialize users table if it doesn't exist
  const mockUsers = getStorageData('mock_db_users', []);
  if (mockUsers.length === 0) {
    // Create demo user as specified in SQL
    saveStorageData('mock_db_users', [
      {
        id: 1,
        username: "demo",
        email: "demo@example.com",
        phone: null,
        password: "password",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
    console.log("Initialized users table with demo user");
  }
  
  // Initialize categories table if it doesn't exist
  const mockCategories = getStorageData('mock_db_categories', []);
  if (mockCategories.length === 0) {
    // Create categories as specified in SQL
    const categories = [
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
    
    saveStorageData('mock_db_categories', categories.map((cat, index) => ({
      id: index + 1,
      name: cat.name,
      icon: cat.icon,
      created_at: new Date().toISOString()
    })));
    console.log("Initialized categories table with default categories");
  }
  
  // Initialize other tables if they don't exist
  if (!localStorage.getItem('mock_db_transactions')) {
    saveStorageData('mock_db_transactions', []);
    console.log("Initialized empty transactions table");
  }
  
  if (!localStorage.getItem('mock_db_budgets')) {
    saveStorageData('mock_db_budgets', []);
    console.log("Initialized empty budgets table");
  }
  
  if (!localStorage.getItem('mock_db_otps')) {
    saveStorageData('mock_db_otps', []);
    console.log("Initialized empty otps table");
  }
  
  console.log("Database initialization complete");
}

// Execute initialization on import
initializeDatabase();

// Helper function to simulate SQL queries
export async function query(sql: string, params: any[] = []) {
  console.log('Mock SQL query:', sql, params);
  
  // Get current data
  const mockUsers = getStorageData('mock_db_users', []);
  const mockOtps = getStorageData('mock_db_otps', []);
  const mockTransactions = getStorageData('mock_db_transactions', []);
  const mockBudgets = getStorageData('mock_db_budgets', []);
  const mockCategories = getStorageData('mock_db_categories', []);
  
  // Handle different query types
  if (sql.toLowerCase().includes('select * from users')) {
    console.log('Returning users:', mockUsers);
    return Promise.resolve(mockUsers);
  }
  
  if (sql.toLowerCase().includes('select * from otps')) {
    console.log('Returning OTPs:', mockOtps);
    return Promise.resolve(mockOtps);
  }
  
  if (sql.toLowerCase().includes('select * from transactions')) {
    console.log('Returning transactions:', mockTransactions);
    return Promise.resolve(mockTransactions);
  }
  
  if (sql.toLowerCase().includes('select * from budgets')) {
    console.log('Returning budgets:', mockBudgets);
    return Promise.resolve(mockBudgets);
  }
  
  if (sql.toLowerCase().includes('select * from categories')) {
    console.log('Returning categories:', mockCategories);
    return Promise.resolve(mockCategories);
  }
  
  // For INSERT operations
  if (sql.toLowerCase().includes('insert into users')) {
    const newUser = {
      id: mockUsers.length > 0 ? Math.max(...mockUsers.map((u: any) => u.id)) + 1 : 1,
      username: params[0],
      email: params[1],
      password: params[2],
      phone: params[3] || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    saveStorageData('mock_db_users', mockUsers);
    console.log('User created:', newUser);
    return Promise.resolve({ insertId: newUser.id });
  }
  
  if (sql.toLowerCase().includes('insert into otps')) {
    const newOtp = {
      id: mockOtps.length > 0 ? Math.max(...mockOtps.map((o: any) => o.id)) + 1 : 1,
      user_id: params[0],
      contact: params[1],
      otp_code: params[2],
      expires_at: params[3],
      created_at: new Date().toISOString()
    };
    mockOtps.push(newOtp);
    saveStorageData('mock_db_otps', mockOtps);
    console.log('OTP created:', newOtp);
    return Promise.resolve({ insertId: newOtp.id });
  }
  
  // For UPDATE operations
  if (sql.toLowerCase().includes('update users')) {
    const userIndex = mockUsers.findIndex(u => u.id === params[params.length - 1]);
    if (userIndex !== -1) {
      // Update password
      if (sql.toLowerCase().includes('password')) {
        mockUsers[userIndex].password = params[0];
        mockUsers[userIndex].updated_at = new Date().toISOString();
      } else {
        // Update profile
        mockUsers[userIndex].username = params[0];
        mockUsers[userIndex].email = params[1];
        mockUsers[userIndex].phone = params[2];
        mockUsers[userIndex].updated_at = new Date().toISOString();
      }
      saveStorageData('mock_db_users', mockUsers);
      console.log('User updated:', mockUsers[userIndex]);
      return Promise.resolve({ affectedRows: 1 });
    }
  }
  
  // For DELETE operations
  if (sql.toLowerCase().includes('delete from otps')) {
    const otpIndex = mockOtps.findIndex(o => o.id === params[0]);
    if (otpIndex !== -1) {
      mockOtps.splice(otpIndex, 1);
      saveStorageData('mock_db_otps', mockOtps);
      return Promise.resolve({ affectedRows: 1 });
    }
  }
  
  return Promise.resolve([]);
}

// User authentication functions
export async function createUser(username: string, email: string, password: string, phone?: string) {
  console.log('Creating user:', username, email, phone);
  
  // Get current users
  const mockUsers = getStorageData('mock_db_users', []);
  
  // Check if user exists by email
  if (email) {
    const existingUserByEmail = mockUsers.find((user: any) => user.email === email);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }
  }
  
  // Check if user exists by phone (if provided)
  if (phone) {
    const existingUserByPhone = mockUsers.find((user: any) => user.phone === phone);
    if (existingUserByPhone) {
      throw new Error('User with this phone number already exists');
    }
  }
  
  // Create new user with current timestamp
  const newUser = {
    id: mockUsers.length > 0 ? Math.max(...mockUsers.map((u: any) => u.id)) + 1 : 1,
    username,
    email,
    phone: phone || null,
    password, // In a real app, this would be hashed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  saveStorageData('mock_db_users', mockUsers);
  
  console.log('User created:', newUser);
  console.log('Current users in database:', mockUsers);
  
  return newUser;
}

export async function getUserByEmail(email: string) {
  console.log('Getting user by email:', email);
  const mockUsers = getStorageData('mock_db_users', []);
  console.log('Searching in users:', mockUsers);
  const user = mockUsers.find((user: any) => user.email === email);
  return user || null;
}

export async function getUserByPhone(phone: string) {
  console.log('Getting user by phone:', phone);
  const mockUsers = getStorageData('mock_db_users', []);
  const user = mockUsers.find((user: any) => user.phone === phone);
  return user || null;
}

export async function verifyCredentials(email: string, password: string) {
  console.log('Verifying credentials for:', email);
  const mockUsers = getStorageData('mock_db_users', []);
  console.log('Available users:', mockUsers);
  
  // In a real app, you would verify the hash
  const user = mockUsers.find((user: any) => user.email === email && user.password === password);
  return user || null;
}

// OTP related functions
export async function storeOTP(userId: number | null, contact: string, otp: string, expiresAt: Date) {
  console.log('Storing OTP for contact:', contact, otp);
  
  const mockOtps = getStorageData('mock_db_otps', []);
  
  // Remove any existing OTPs for this contact
  const filteredOtps = mockOtps.filter((otpRecord: any) => otpRecord.contact !== contact);
  
  // Store new OTP
  const newOtp = {
    id: mockOtps.length > 0 ? Math.max(...mockOtps.map((o: any) => o.id)) + 1 : 1,
    user_id: userId,
    contact,
    otp_code: otp,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString()
  };
  
  filteredOtps.push(newOtp);
  saveStorageData('mock_db_otps', filteredOtps);
  console.log('Current OTPs in database:', filteredOtps);
  
  return true;
}

export async function verifyOTP(contact: string, otp: string) {
  console.log('Verifying OTP for contact:', contact, otp);
  const mockOtps = getStorageData('mock_db_otps', []);
  console.log('Available OTPs:', mockOtps);
  
  const otpRecord = mockOtps.find((record: any) => 
    record.contact === contact && 
    record.otp_code === otp && 
    new Date(record.expires_at) > new Date()
  );
  
  if (otpRecord) {
    // Remove the OTP after successful verification (one-time use)
    const filteredOtps = mockOtps.filter((record: any) => record.id !== otpRecord.id);
    saveStorageData('mock_db_otps', filteredOtps);
    return true;
  }
  
  return false;
}

export async function getOTPByContact(contact: string) {
  const mockOtps = getStorageData('mock_db_otps', []);
  const otpRecord = mockOtps.find((record: any) => 
    record.contact === contact && 
    new Date(record.expires_at) > new Date()
  );
  console.log(`OTP for ${contact}:`, otpRecord ? otpRecord.otp_code : 'None found');
  return otpRecord || null;
}

// Update user profile
export async function updateUserProfile(userId: number, username: string, email: string, phone?: string) {
  console.log('Updating user profile:', userId, username, email, phone);
  
  const mockUsers = getStorageData('mock_db_users', []);
  const userIndex = mockUsers.findIndex((user: any) => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user fields
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    username,
    email,
    phone: phone || null,
    updated_at: new Date().toISOString()
  };
  
  saveStorageData('mock_db_users', mockUsers);
  console.log('User updated:', mockUsers[userIndex]);
  
  return mockUsers[userIndex];
}

// Update password
export async function updatePassword(userId: number, currentPassword: string, newPassword: string) {
  console.log('Updating password for user:', userId);
  
  const mockUsers = getStorageData('mock_db_users', []);
  const userIndex = mockUsers.findIndex((user: any) => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Verify current password
  if (mockUsers[userIndex].password !== currentPassword) {
    console.log("Current password doesn't match");
    return false;
  }
  
  // Update password
  mockUsers[userIndex].password = newPassword;
  mockUsers[userIndex].updated_at = new Date().toISOString();
  
  saveStorageData('mock_db_users', mockUsers);
  console.log('Password updated for user:', userId);
  
  return true;
}

// Get all users (for testing purposes)
export async function getAllUsers() {
  const mockUsers = getStorageData('mock_db_users', []);
  console.log('Getting all users:', mockUsers);
  return [...mockUsers];
}

// Transaction related functions
export async function createTransaction(userId: number, amount: number, type: string, category: string, description: string, date: Date) {
  console.log('Creating transaction:', { userId, amount, type, category, description, date });
  
  const mockTransactions = getStorageData('mock_db_transactions', []);
  
  const newTransaction = {
    id: mockTransactions.length > 0 ? Math.max(...mockTransactions.map((t: any) => t.id)) + 1 : 1,
    user_id: userId,
    amount,
    type,
    category,
    description,
    date: date instanceof Date ? date.toISOString() : date,
    created_at: new Date().toISOString()
  };
  
  mockTransactions.push(newTransaction);
  saveStorageData('mock_db_transactions', mockTransactions);
  
  console.log('Transaction created:', newTransaction);
  console.log('Current transactions in database:', mockTransactions);
  
  return newTransaction;
}

export async function getTransactionsByUserId(userId: number) {
  console.log('Getting transactions for user:', userId);
  const mockTransactions = getStorageData('mock_db_transactions', []);
  const transactions = mockTransactions.filter((transaction: any) => transaction.user_id === userId);
  console.log('Found transactions:', transactions);
  return transactions;
}

// Update transaction by ID
export async function updateTransaction(id: number, updates: {amount?: number, type?: string, category?: string, description?: string, date?: Date}) {
  console.log('Updating transaction:', { id, updates });
  
  const mockTransactions = getStorageData('mock_db_transactions', []);
  const transactionIndex = mockTransactions.findIndex((transaction: any) => transaction.id === id);
  
  if (transactionIndex === -1) {
    console.error('Transaction not found:', id);
    throw new Error('Transaction not found');
  }
  
  // Update transaction fields
  mockTransactions[transactionIndex] = {
    ...mockTransactions[transactionIndex],
    ...updates,
    date: updates.date instanceof Date ? updates.date.toISOString() : 
          (updates.date || mockTransactions[transactionIndex].date),
    updated_at: new Date().toISOString()
  };
  
  saveStorageData('mock_db_transactions', mockTransactions);
  console.log('Transaction updated:', mockTransactions[transactionIndex]);
  return mockTransactions[transactionIndex];
}

// Delete transaction by ID
export async function deleteTransaction(id: number) {
  console.log('Deleting transaction:', id);
  
  const mockTransactions = getStorageData('mock_db_transactions', []);
  const transactionIndex = mockTransactions.findIndex((transaction: any) => transaction.id === id);
  
  if (transactionIndex === -1) {
    console.error('Transaction not found:', id);
    throw new Error('Transaction not found');
  }
  
  const deletedTransaction = mockTransactions[transactionIndex];
  mockTransactions.splice(transactionIndex, 1);
  
  saveStorageData('mock_db_transactions', mockTransactions);
  console.log('Transaction deleted:', deletedTransaction);
  console.log('Current transactions in database:', mockTransactions);
  
  return deletedTransaction;
}

// Budget related functions
export async function createBudget(userId: number, category: string, amount: number, period: string) {
  console.log('Creating budget:', { userId, category, amount, period });
  
  const mockBudgets = getStorageData('mock_db_budgets', []);
  
  const newBudget = {
    id: mockBudgets.length > 0 ? Math.max(...mockBudgets.map((b: any) => b.id)) + 1 : 1,
    user_id: userId,
    category,
    amount,
    period,
    created_at: new Date().toISOString()
  };
  
  mockBudgets.push(newBudget);
  saveStorageData('mock_db_budgets', mockBudgets);
  
  console.log('Budget created:', newBudget);
  console.log('Current budgets in database:', mockBudgets);
  
  return newBudget;
}

export async function getBudgetsByUserId(userId: number) {
  console.log('Getting budgets for user:', userId);
  const mockBudgets = getStorageData('mock_db_budgets', []);
  const budgets = mockBudgets.filter((budget: any) => budget.user_id === userId);
  console.log('Found budgets:', budgets);
  return budgets;
}

// Database schema reference (matches the SQL you provided)
export const CREATE_TABLES_QUERIES = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  
  `CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    contact VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  
  `CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  
  `CREATE TABLE IF NOT EXISTS budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    period ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  
  `CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
];

// Re-initialize the database on import to ensure data is set up
initializeDatabase();
