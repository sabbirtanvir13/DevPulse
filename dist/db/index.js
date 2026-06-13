import { Pool } from 'pg';
import config from '../config';
export const pool = new Pool({
    connectionString: config.database_url
});
export const initDB = async () => {
    await pool.query(`
   CREATE TABLE IF NOT EXISTS users(
      id SERIAL UNIQUE PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255)  NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'contributor' ,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL UNIQUE  PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL 
      CHECK(LENGTH(description) >=20),
       type VARCHAR(20) NOT NULL
       CHECK(type IN ('bug','feature_request')) ,
      status VARCHAR(15) NOT NULL DEFAULT 'open'
      CHECK(status IN ('open','in_progress','resolved')) ,
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
    console.log('DataBase connected ');
};
//# sourceMappingURL=index.js.map