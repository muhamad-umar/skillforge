// Placeholder DB config — fill in with your DB credentials.
module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'skillforge',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'skillforge',
};
