require('dotenv').config({ silent: true });

module.exports = {
  port: process.env.PORT || 5000,
  database: process.env.MONGO_PROD_URL,
  test_database: process.env.MONGO_TEST_URL,
  secret: process.env.MONGO_SECRET,
};
