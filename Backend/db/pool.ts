import { Pool } from 'pg';

const pool = new Pool({
    user: 'user',
    host: 'postgres',
    database: 'asset-management',
    password: 'pass',
    port: 5432
});

export default pool;