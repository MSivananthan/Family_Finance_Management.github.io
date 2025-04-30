
# Family Finance Database

This directory contains the database structure and connection utilities for the Family Finance application.

## Database Structure

The application uses a MySQL database with the following tables:

1. `users` - Stores user account information
2. `otps` - Stores one-time passwords for authentication
3. `transactions` - Records financial transactions
4. `budgets` - Stores budget limits by category
5. `categories` - Predefined expense/income categories

## Files

- `database_creation.sql` - SQL script to create the database structure
- `database_connection.ts` - Utility for connecting to the database in a Node.js environment

## Setting Up the Database

### Local Development

1. Install MySQL on your local machine
2. Run the SQL script from `database_creation.sql`
3. Create a `.env` file with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

### Production Deployment

For production, you would need to:

1. Set up a MySQL database server (e.g., Amazon RDS, Google Cloud SQL)
2. Run the `database_creation.sql` script on your production database
3. Configure environment variables for the database connection

## Integration with the Application

In a complete application:

1. The frontend would call API endpoints
2. Those API endpoints would use the `database_connection.ts` utility to interact with the database
3. For the demo version, the application uses a mock implementation in `mysql.ts`

When moving to production, replace the mock implementation with actual database calls using the connection utility.
