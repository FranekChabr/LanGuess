require('dotenv').config({path: '.env'});
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
sql`SELECT count(*) FROM sentences WHERE difficulty='easy'`
  .then(console.log)
  .then(() => sql`SELECT content, language_code FROM sentences WHERE difficulty='easy'`)
  .then(console.log)
  .finally(() => sql.end());