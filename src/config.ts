import "dotenv/config";

export default {
    port: process.env.PORT || 4000,
    connectionString: process.env.DATABASE_URL
}; 