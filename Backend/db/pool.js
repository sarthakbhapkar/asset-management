"use strict";
exports.__esModule = true;
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    user: 'user',
    host: 'postgres',
    database: 'asset-management',
    password: 'pass',
    port: 5432
});
exports["default"] = pool;
