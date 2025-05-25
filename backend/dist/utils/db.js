   import { Client } from 'pg';
   import dotenv from 'dotenv';

   dotenv.config();

   const connectDB = async (): Promise<void> => {
       const client = new Client({
           connectionString: process.env.DATABASE_URL, // Use your PostgreSQL connection string here
       });

       try {
           await client.connect();
           console.log('PostgreSQL connected successfully.');
       } catch (error) {
           console.error('Error connecting to PostgreSQL:', error);
           process.exit(1);
       }
   };

   export default connectDB;
   
