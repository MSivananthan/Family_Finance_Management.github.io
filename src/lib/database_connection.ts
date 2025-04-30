
// This is a mock implementation for client-side development

export async function createDatabaseConnection() {
  console.log('Mock database connection created');
  
  // In a real application, this would connect to a MySQL server
  // For client-side development, we'll use localStorage for persistence
  
  // Initialize localStorage if needed
  if (!localStorage.getItem('mock_db_users')) {
    localStorage.setItem('mock_db_users', JSON.stringify([
      {
        id: 1,
        username: "demo",
        email: "demo@example.com",
        phone: null,
        password: "password",
        created_at: new Date().toISOString()
      }
    ]));
  }
  
  if (!localStorage.getItem('mock_db_otps')) {
    localStorage.setItem('mock_db_otps', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('mock_db_transactions')) {
    localStorage.setItem('mock_db_transactions', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('mock_db_budgets')) {
    localStorage.setItem('mock_db_budgets', JSON.stringify([]));
  }
  
  return {
    query: async (sql: string, params?: any[]) => {
      console.log('Mock query executed:', sql, params);
      
      // Simple mock implementation to simulate basic CRUD operations
      if (sql.toLowerCase().includes('select * from users')) {
        return [JSON.parse(localStorage.getItem('mock_db_users') || '[]')];
      }
      
      if (sql.toLowerCase().includes('select * from otps')) {
        return [JSON.parse(localStorage.getItem('mock_db_otps') || '[]')];
      }
      
      if (sql.toLowerCase().includes('insert into users')) {
        const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
        const newId = users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1;
        
        if (params && params.length >= 4) {
          const newUser = {
            id: newId,
            username: params[0],
            email: params[1],
            phone: params[2],
            password: params[3],
            created_at: new Date().toISOString()
          };
          users.push(newUser);
          localStorage.setItem('mock_db_users', JSON.stringify(users));
          return [{ insertId: newId }];
        }
      }
      
      if (sql.toLowerCase().includes('update users')) {
        // Handle user updates including password changes
        const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
        if (params && params.length > 0) {
          // Last param is usually the user ID in UPDATE queries
          const userId = params[params.length - 1];
          const index = users.findIndex((u: any) => u.id === userId);
          
          if (index !== -1) {
            // Handle password update or profile update
            if (sql.toLowerCase().includes('password')) {
              users[index].password = params[0];
            } else {
              // Handle general profile updates
              if (params.length >= 3) {
                users[index].username = params[0];
                users[index].email = params[1];
                users[index].phone = params[2];
              }
            }
            users[index].updated_at = new Date().toISOString();
            localStorage.setItem('mock_db_users', JSON.stringify(users));
            return [{ affectedRows: 1 }];
          }
        }
      }
      
      if (sql.toLowerCase().includes('insert into otps')) {
        const otps = JSON.parse(localStorage.getItem('mock_db_otps') || '[]');
        const newId = otps.length > 0 ? Math.max(...otps.map((o: any) => o.id)) + 1 : 1;
        
        if (params && params.length >= 4) {
          const newOtp = {
            id: newId,
            user_id: params[0],
            contact: params[1],
            otp_code: params[2],
            expires_at: params[3],
            created_at: new Date().toISOString()
          };
          otps.push(newOtp);
          localStorage.setItem('mock_db_otps', JSON.stringify(otps));
          return [{ insertId: newId }];
        }
      }
      
      return [[], {}];
    },
    end: async () => {
      console.log('Mock connection closed');
    }
  };
}
